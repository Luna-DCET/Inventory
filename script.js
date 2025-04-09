// CONST VALUES

let currentRow = null;
const modal = document.getElementById("editModal");
const closeBtn = document.getElementById("closeBtn");
const saveBtn = document.getElementById("saveBtn");
const table = document.getElementById("inventoryTable");
const searchInput = document.getElementById("searchInput");

// SEARCH BAR FUNCTION

document.getElementById("searchBar").addEventListener("keydown", function (event) {

    // ACTIVATES WHEN ENTER IS PRESSED

    if (event.key === "Enter") {
        
        // CASE CONVERTER
        const filter = this.value.trim().toLowerCase();
        const rows = document.querySelectorAll("#inventoryTable tr");
        
        let anyVisible = false;
        rows.forEach((row, index) => {
            if (index < 2) return; // SKIP HEADERS

            const text = row.innerText.toLowerCase();

            // FILTER (CLEARED)

            if (filter === "") {
                row.style.display = ""; 
                anyVisible = true;

                // FILTER (RESULT MATCHES)
            } else if (text.includes(filter)) {
                row.style.display = "";
                anyVisible = true;

                // FILTER (NO MATCHES) 

            } else {
                row.style.display = "none";
            }
        });

        // HIDES ROWS IF NO MATCHES

        if (!anyVisible) {
            rows.forEach((row, index) => {
                if (index >= 2) row.style.display = "none";
            });
        }
    }
});

// SORT FUNCTION

let sortDirection = {}; 

// FUNCTION REFERS TO THE TABLE

function sortTableByColumn(colIndex) {
    const rows = Array.from(table.rows).slice(2);

    // SORT TOGGLE (ARRAY)
    const direction = sortDirection[colIndex] = !sortDirection[colIndex];
    // SORT TOGGLE (FLOAT)
    const isNumeric = colIndex >= 2 && colIndex <= 3;

    // SORT MECHANISM

    rows.sort((a, b) => {

        // COMPARE VALUES

        let valA = a.cells[colIndex].getAttribute("data-value") || a.cells[colIndex].innerText;
        let valB = b.cells[colIndex].getAttribute("data-value") || b.cells[colIndex].innerText;

        // SORTING ORDER

        if (isNumeric) {
            return direction ? valA - valB : valB - valA;
        } else {
            return direction ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
    });

    // DISPLAY BACK AS SORTED
    rows.forEach(row => table.appendChild(row));

    // UPDATE SORT ICON, RESET
    document.querySelectorAll(".sort-icon").forEach(icon => {
        icon.textContent = "↕";
    });

    // UPDATE SELECTED SORT ICON
    const icon = document.querySelector(`.sort-icon[data-col="${colIndex}"]`);
    if (icon) icon.textContent = direction ? "↑" : "↓";
}

// EDIT BUTTON

function editItem(button) {

    // SEARCH FOR CLOSEST ROW
    currentRow = button.closest("tr");

    // EDIT INDIVIDUAL FORMS

    document.getElementById("editName").value = currentRow.cells[0].innerText;
    document.getElementById("editDetails").value = currentRow.cells[1].innerText;
    document.getElementById("editQuantity").value = currentRow.cells[2].innerText;
    document.getElementById("editPrice").value = currentRow.cells[3].innerText.replace("$", "");
    document.getElementById("editDate").value = currentRow.cells[4].innerText;

    modal.style.display = "flex";
}


// ADD CLICK, SHOW MODAL

document.getElementById("addBtn").addEventListener("click", () => {
    currentRow = null;
    document.getElementById("editForm").reset();
    modal.style.display = "flex";
});

// FORMS

document.getElementById("editForm").addEventListener("submit", (e) => {
    e.preventDefault();

    // CAPTURES INPUT

    const name = document.getElementById("editName").value;
    const details = document.getElementById("editDetails").value;
    const quantity = document.getElementById("editQuantity").value;
    const price = document.getElementById("editPrice").value;
    const date = document.getElementById("editDate").value;

    // UPDATE CHANGES

    if (currentRow) {

        currentRow.cells[0].innerText = name;
        currentRow.cells[1].innerText = details;
        currentRow.cells[1].setAttribute("data-value", details);
        currentRow.cells[2].innerText = quantity;
        currentRow.cells[2].setAttribute("data-value", quantity);
        currentRow.cells[3].innerText = `$${price}`;
        currentRow.cells[3].setAttribute("data-value", price);
        currentRow.cells[4].innerText = date;
        currentRow.cells[4].setAttribute("data-value", date);
    } else {

        // ADD NEW ROW

        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${name}</td>
            <td data-value="${details}">${details}</td>
            <td data-value="${quantity}">${quantity}</td>
            <td data-value="${price}">$${price}</td>
            <td data-value="${date}">${date}</td>
            <td>
                <button onclick="editItem(this)">Edit</button>
                <button onclick="removeItem(this)">Remove</button>
            </td>
        `;
    }

    // EXITS MODAL

    modal.style.display = "none";
});


// REMOVE BUTTON FUNCTION
function removeItem(button) {
    button.closest("tr").remove();
}

// CLOSE MODAL (X) BUTTON
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
