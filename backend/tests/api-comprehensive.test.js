// @ts-check
import { test, expect } from "@playwright/test";

// Force sequential running of tests
test.describe.configure({ mode: "serial" });

test.describe("API Comprehensive Tests", () => {
  // Store assessmentId for use across tests
  let assessmentId;

  // Test the hello endpoint
  test("should return Hello World message with correct format", async ({
    request,
  }) => {
    // Send a request to the API endpoint
    const response = await request.get("/api/hello");

    // Verify the status code is 200 (OK)
    expect(response.status()).toBe(200);

    // Verify response headers indicate JSON content type
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");

    // Parse the response body as JSON
    const responseBody = await response.json();

    // Verify the message matches what we expect
    expect(responseBody).toHaveProperty("message");
    expect(responseBody.message).toBe("Hello World from Dottie API!");
    expect(Object.keys(responseBody).length).toBe(1); // Only contains 'message' property
  });

  // Test error case - endpoint not found
  test("should return 404 for non-existent endpoint", async ({ request }) => {
    // Send a request to a non-existent API endpoint
    const response = await request.get("/api/non-existent-endpoint");

    // Verify the status code is 404 (Not Found)
    expect(response.status()).toBe(404);
  });

  // Test starting a new assessment
  test("should start a new assessment", async ({ request }) => {
    const response = await request.post("/api/assessment/start");

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body).toHaveProperty("assessmentId");
    expect(body).toHaveProperty("question");
    expect(body.question.id).toBe(1);
    expect(body.question.text).toBe("What is your age?");
    expect(body.question.options.length).toBe(5);
    expect(body.question.progress).toBe("16%");

    // Save assessmentId for later tests
    assessmentId = body.assessmentId;
  });

  // Test submitting answer to question 1
  test("should accept answer to question 1 and return question 2", async ({
    request,
  }) => {
    // Use this format for all request.post calls
    const response = await request.post("/api/assessment/answer", {
      headers: { "Content-Type": "application/json" },
      data: {
        assessmentId,
        questionId: 1,
        answer: "15_17",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty("question");
    expect(body.question.id).toBe(2);
    expect(body.question.text).toBe("How long is your menstrual cycle?");
    expect(body.progress).toBe("16%"); // Changed back from 17% to 16%
  });

  // Test submitting answer to question 2
  test("should accept answer to question 2 and return question 3", async ({
    request,
  }) => {
    const response = await request.post("/api/assessment/answer", {
      data: {
        // Use data property
        assessmentId: assessmentId,
        questionId: 2,
        answer: "26_30",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty("question");
    expect(body.question.id).toBe(3);
    expect(body.question.text).toBe(
      "How many days does your period typically last?"
    );
    expect(body.progress).toBe("33%"); // Progress after Q2
  });

  // Test submitting answer to question 3
  test("should accept answer to question 3 and return question 4", async ({
    request,
  }) => {
    const response = await request.post("/api/assessment/answer", {
      data: {
        // Use data property
        assessmentId: assessmentId,
        questionId: 3,
        answer: "4_5",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty("question");
    expect(body.question.id).toBe(4);
    expect(body.question.text).toBe(
      "How would you describe your menstrual flow?"
    );
    expect(body.progress).toBe("50%"); // Progress after Q3
  });

  // Test submitting answer to question 4
  test("should accept answer to question 4 and return question 5", async ({
    request,
  }) => {
    const response = await request.post("/api/assessment/answer", {
      data: {
        // Use data property
        assessmentId: assessmentId,
        questionId: 4,
        answer: "moderate",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty("question");
    expect(body.question.id).toBe(5);
    expect(body.question.text).toBe("How would you rate your menstrual pain?");
    expect(body.progress).toBe("67%"); // Progress after Q4
  });

  // Test submitting answer to question 5
  test("should accept answer to question 5 and return question 6", async ({
    request,
  }) => {
    const response = await request.post("/api/assessment/answer", {
      data: {
        // Use data property
        assessmentId: assessmentId,
        questionId: 5,
        answer: "moderate",
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty("question");
    expect(body.question.id).toBe(6);
    expect(body.question.text).toBe(
      "Do you experience any other symptoms with your period?"
    );
    expect(body.progress).toBe("83%"); // Progress after Q5
  });

  // Test submitting answer to final question
  test("should accept answer to question 6 and indicate completion", async ({
    request,
  }) => {
    const response = await request.post("/api/assessment/answer", {
      data: {
        // Use data property
        assessmentId: assessmentId,
        questionId: 6,
        answer: {
          physical: ["Bloating", "Headaches"],
          emotional: ["Mood swings", "Irritability"],
        },
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty("complete");
    expect(body.complete).toBe(true);
    expect(body).toHaveProperty("message");
    expect(body).toHaveProperty("resultsUrl");
    expect(body.resultsUrl).toBe(`/api/assessment/results/${assessmentId}`);
  });

  // Test getting assessment results
  test("should retrieve assessment results with analysis and recommendations", async ({
    request,
  }) => {
    const response = await request.get(
      `/api/assessment/results/${assessmentId}`
    );

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty("assessmentId");
    expect(body.assessmentId).toBe(assessmentId);
    expect(body).toHaveProperty("results");
    expect(body).toHaveProperty("completedAt");

    // Validate results structure
    const results = body.results;
    expect(results).toHaveProperty("status");
    expect(results).toHaveProperty("cycleDetails");
    expect(results).toHaveProperty("analysis");
    expect(results).toHaveProperty("recommendations");

    // Validate specific content based on our answers
    expect(results.cycleDetails.age).toBe("Late adolescence");
    expect(results.cycleDetails.cycleLength).toBe("26-30 days");
    expect(results.cycleDetails.periodDuration).toBe("4-5 days");
    expect(results.cycleDetails.painLevel).toBe("Moderate");
    expect(results.cycleDetails.flowHeaviness).toBe("Moderate");

    // Check that symptoms are recorded
    const symptomsList = results.cycleDetails.symptoms;
    expect(symptomsList).toContain("Bloating");
    expect(symptomsList).toContain("Headaches");
    expect(symptomsList).toContain("Mood swings");
    expect(symptomsList).toContain("Irritability");

    // Check for pain-related recommendations due to moderate pain
    const recommendationTitles = results.recommendations.map((r) => r.title);
    expect(recommendationTitles).toContain("Pain Management");
  });

  // Test error handling - non-existent assessment
  test("should handle request for non-existent assessment", async ({
    request,
  }) => {
    const response = await request.get(
      "/api/assessment/results/non-existent-id"
    );

    expect(response.status()).toBe(404);
    const body = await response.json();

    expect(body).toHaveProperty("error");
    expect(body.error).toBe("Assessment not found");
  });

  // Test error handling - submitting answer to invalid question
  test("should reject answer for invalid question", async ({ request }) => {
    const response = await request.post("/api/assessment/answer", {
      data: {
        // Use data property
        assessmentId: assessmentId,
        questionId: 999, // Non-existent question
        answer: "some_answer",
      },
    });

    expect(response.status()).toBe(400);
    // Your implementation might return a different status code
    // Update the test based on how your API handles this case
  });
});
