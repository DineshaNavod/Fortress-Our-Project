let totalSaved = 0;
let target = 0;

function addMoney() {
  const added = parseFloat(document.getElementById("addAmount").value);
  const targetInput = parseFloat(document.getElementById("targetAmount").value);

  if (!target || target !== targetInput) {
    target = targetInput;
  }

  if (!isNaN(added)) {
    totalSaved += added;
    const progress = Math.min((totalSaved / target) * 100, 100);
    document.getElementById("progressBar").style.width = progress + "%";
    document.getElementById(
      "statusText"
    ).innerText = `Completed: ${progress.toFixed(2)}%`;
    document.getElementById("addAmount").value = "";
  }
}
