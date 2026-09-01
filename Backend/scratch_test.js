async function run() {
  const tests = [
    { name: 'Hunterz', auctionId: '6a8a705aef1f9e0978b3031c', phone: '9000000001' },
    { name: 'BNI', auctionId: '6a8edaddd7ed74151dbafab3', phone: '9491518922' },
    { name: 'JSC', auctionId: '6a8ed4afb1d04e719c5866a6', phone: '9949398059' }
  ];

  for (const t of tests) {
    const res = await fetch('http://localhost:5000/api/players/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auctionId: t.auctionId,
        name: 'Duplicate Test Player',
        phone: t.phone
      })
    });
    const data = await res.json();
    console.log(t.name + ' rejection result:', data);
  }
}
run();
