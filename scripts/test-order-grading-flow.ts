import { evaluateGrading, gradingCriteria } from "../src/data/grading";
import { db } from "../src/db";
import {
  placeOrderFn,
  confirmOrderAsSellerFn,
  getOrRestoreSession,
} from "../src/lib/server-functions";
import { listOrdersFn } from "../src/lib/db-server";
import { rowToOrderRecord } from "../src/lib/order-store";
import { runWithStartContext, type StartStorageContext } from "@tanstack/start-storage-context";

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  const mockContext = {
    getRouter: () => ({}) as unknown,
    request: new Request("http://localhost"),
    startOptions: {},
    contextAfterGlobalMiddlewares: {},
    executedRequestMiddlewares: new Set(),
    handlerType: "serverFn" as const,
  };

  return runWithStartContext(mockContext as unknown as StartStorageContext, async () => {
    console.log("\n=======================================================");
    console.log("  TEST SUITE: GRADING, CHECKOUT RESERVATION & PRIVACY");
    console.log("=======================================================\n");

    // -------------------------------------------------------------
    // Test 1: Grading Evaluation & Deterministic Capping
    // -------------------------------------------------------------
    console.log("1. Grading Algorithm & Capping");

    const pristineAnswers: Record<string, string> = {
      physical: "pristine",
      screen: "original",
      functionality: "full",
      battery: "95",
      repairs: "none",
    };
    const pristineResult = evaluateGrading(pristineAnswers);
    assert(pristineResult.complete === true, "All criteria answered");
    assert(pristineResult.conditionScore === 100, "Pristine score is 100");
    assert(pristineResult.grade === "A+", "Pristine grade is A+");

    const defectiveAnswers: Record<string, string> = {
      physical: "pristine", // 25 pts
      screen: "defect", // 5 pts, capped at C!
      functionality: "full", // 25 pts
      battery: "95", // 15 pts
      repairs: "none", // 10 pts
    };
    const defectiveResult = evaluateGrading(defectiveAnswers);
    // Total pts: 25 + 5 + 25 + 15 + 10 = 80 pts (which would be Grade B on score alone),
    // but screen-defect has grade_cap 'C' -> Grade must be capped at C!
    assert(defectiveResult.conditionScore === 80, "Defective screen condition score is 80");
    assert(defectiveResult.grade === "C", "Grade is capped strictly at C despite 80 score");
    assert(
      defectiveResult.reasons.some((r) => r.includes("Screen / display")),
      "Reason explains screen capping",
    );

    // -------------------------------------------------------------
    // Test 2: Checkout Reservation Integrity & Conflict Error
    // -------------------------------------------------------------
    console.log("\n2. Checkout Reservation Conflict Detection");

    // Create a test listing in db.listings
    const testListingId = `test-list-${Date.now()}`;
    db.listings.push({
      id: testListingId,
      productId: "iphone-15-pro-256",
      sellerId: "u-1",
      pricePoisha: 8500000,
      grade: "A",
      conditionScore: 92,
      status: "RESERVED", // ALREADY RESERVED!
      moderationStatus: "APPROVED",
      physicalCondition: "Pristine",
      screenCondition: "Original",
      batteryHealth: 94,
      hasInvoice: true,
      warrantyMonths: 6,
      accessories: "Box, Cable",
      sellerNote: "Reserved item",
      listedAt: new Date().toISOString(),
      isSeed: false,
      submittedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: "u-admin",
      rejectionReasonCode: null,
      rejectionReasonText: null,
      repairs: "none",
    });

    // Attempt placing order on this already-reserved item
    const placeRes = await placeOrderFn({
      data: {
        listingId: testListingId,
        listingIds: [testListingId],
        buyerId: "u-test-buyer",
        amount: 85000,
        paymentMethod: "cod",
        shippingAddress: {
          name: "Test Buyer",
          phone: "01700000001",
          division: "Dhaka",
          district: "Dhaka",
          area: "Dhanmondi",
          addressLine: "Road 27, House 12",
        },
        nidNumber: "199526920199201",
      },
    });

    assert(placeRes.success === false, "Reservation on already RESERVED item fails");
    assert(
      typeof placeRes.error === "string" && placeRes.error.includes("was just reserved"),
      "Returns user-friendly error stating item was just reserved",
    );

    // Now change listing status to ACTIVE and try again
    const activeListing = db.listings.find((l) => l.id === testListingId)!;
    activeListing.status = "ACTIVE";

    const successOrder = await placeOrderFn({
      data: {
        listingId: testListingId,
        listingIds: [testListingId],
        buyerId: "u-test-buyer",
        amount: 85000,
        paymentMethod: "cod",
        shippingAddress: {
          name: "Test Buyer",
          phone: "01700000001",
          division: "Dhaka",
          district: "Dhaka",
          area: "Dhanmondi",
          addressLine: "Road 27, House 12",
        },
        nidNumber: "199526920199201",
      },
    });

    assert(successOrder.success === true, "Reservation on ACTIVE item succeeds");
    assert(
      (activeListing.status as string) === "RESERVED",
      "Listing status transitions to RESERVED atomically",
    );

    // -------------------------------------------------------------
    // Test 3: Order Privacy Scoping (listOrdersFn)
    // -------------------------------------------------------------
    console.log("\n3. Order Privacy & Token Scoping");

    // Unauthenticated call should be rejected
    const unauthRes = await listOrdersFn({ data: {} });
    assert(
      unauthRes.error === "Authentication required to read orders.",
      "Unauthenticated request is rejected to protect PII",
    );
    assert(unauthRes.json === "[]", "Unauthenticated request returns empty array");

    // -------------------------------------------------------------
    // Test 4: Seller Order Confirmation Server Persistence
    // -------------------------------------------------------------
    console.log("\n4. Server-Side Seller Confirmation");

    if (successOrder.orderId) {
      const confirmRes = await confirmOrderAsSellerFn({
        data: {
          orderId: successOrder.orderId,
          sellerId: "u-1",
          note: "Verified physical condition and boxed with security seal.",
        },
      });

      assert(confirmRes.success === true, "Seller order confirmation succeeds");

      const confirmedOrder = db.orders.find((o) => o.id === successOrder.orderId);
      assert(confirmedOrder?.status === "CONFIRMED", "Order status updated to CONFIRMED on server");
      assert(Boolean(confirmedOrder?.confirmedAt), "confirmedAt timestamp recorded");
    }

    // Summary
    console.log("\n=======================================================");
    console.log(`  TEST RESULTS: ${passed} passed, ${failed} failed`);
    console.log("=======================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  });
}

runTests().catch((err) => {
  console.error("Test execution threw exception:", err);
  process.exit(1);
});
