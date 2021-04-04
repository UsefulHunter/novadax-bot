function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function format24hPercent(data) {
  return (((data.lastPrice * 100) / data.open24h) - 100).toFixed(2);
};

module.exports = {
  formatCurrency,
  format24hPercent,
}