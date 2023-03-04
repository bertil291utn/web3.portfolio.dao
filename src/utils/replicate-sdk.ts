const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getPrediction(prompt: string) {

  const response = await fetch("/api/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });
  let prediction = await response.json();
  if (response.status !== 201) {
    throw new Error(prediction.detail);
  }

  while (
    prediction.status !== "succeeded" &&
    prediction.status !== "failed"
  ) {
    await sleep(1000);
    const response = await fetch("/api/predictions/" + prediction.id);
    prediction = await response.json();
    if (response.status !== 200) {
      throw new Error(prediction.detail);
    }

  }
  return prediction
}