document.addEventListener('DOMContentLoaded', () => {
    class ShoppingList {
        constructor() {
            this.items = JSON.parse(localStorage.getItem('shopping_items')) || [];
        }

        saveToLocalStorage() {
            localStorage.setItem('shopping_items', JSON.stringify(this.items));
        }

        addItem(name, quantity) {
            if (!name.trim()) return alert("Item name cannot be empty!");
            
            const newItem = {
                id: Date.now(),
                name: name.trim(),
                quantity: parseInt(quantity) || 1,
                purchased: false
            };

            this.items.push(newItem);
            this.saveToLocalStorage();
        }

        deleteItem(id) {
            this.items = this.items.filter(item => item.id !== id);
            this.saveToLocalStorage();
        }

        togglePurchased(id) {
            const item = this.items.find(item => item.id === id);
            if (item) {
                item.purchased = !item.purchased;
                this.saveToLocalStorage();
            }
        }

        editItem(id, newName, newQty) {
            const item = this.items.find(item => item.id === id);
            if (item && newName.trim()) {
                item.name = newName.trim();
                item.quantity = parseInt(newQty) || 1;
                this.saveToLocalStorage();
            }
        }
    }

    const myList = new ShoppingList();

    const itemInput = document.getElementById('itemInput');
    const qtyInput = document.getElementById('qtyInput');
    const addBtn = document.getElementById('addBtn');
    const shoppingListEl = document.getElementById('shoppingList');
    const searchInput = document.getElementById('searchInput');
    const totalCountEl = document.getElementById('totalCount');

    function render(filterText = '') {
        shoppingListEl.innerHTML = '';
        let count = 0;

        for (let i = 0; i < myList.items.length; i++) {
            const item = myList.items[i];

            if (item.name.toLowerCase().includes(filterText.toLowerCase())) {
                count++;
                const li = document.createElement('li');
                if (item.purchased) li.classList.add('purchased');

                li.innerHTML = '<div>' +
                    '<span><strong>' + item.name + '</strong> (Qty: ' + item.quantity + ')</span>' +
                    '<div class="actions">' +
                        '<button onclick="toggleItem(' + item.id + ')">' + (item.purchased ? 'Unmark' : 'Done') + '</button>' +
                        '<button class="edit-btn" onclick="editPrompt(' + item.id + ')">Edit</button>' +
                        '<button onclick="removeItem(' + item.id + ')">Delete</button>' +
                    '</div>' +
                '</div>';
                
                shoppingListEl.appendChild(li);
            }
        }
        totalCountEl.textContent = count;
    }

    addBtn.addEventListener('click', () => {
        myList.addItem(itemInput.value, qtyInput.value);
        itemInput.value = '';
        qtyInput.value = '1';
        render(searchInput.value);
    });

    searchInput.addEventListener('input', (e) => {
        render(e.target.value);
    });

    window.removeItem = function(id) {
        myList.deleteItem(id);
        render(searchInput.value);
    };

    window.toggleItem = function(id) {
        myList.togglePurchased(id);
        render(searchInput.value);
    };

    window.editPrompt = function(id) {
        const item = myList.items.find(i => i.id === id);
        const newName = prompt("Edit item name:", item.name);
        if (newName !== null) {
            const newQty = prompt("Edit quantity:", item.quantity);
            myList.editItem(id, newName, newQty);
            render(searchInput.value);
        }
    };

    render();
});