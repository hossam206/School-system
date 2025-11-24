async function getData() {
  // simulate slow server work
  await new Promise((r) => setTimeout(r, 3000));

  return {
    message: "Hello from server!",
    time: new Date().toISOString(),
  };
}

export default async function ServerHeavy() {
  const data = await getData();

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Server Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
