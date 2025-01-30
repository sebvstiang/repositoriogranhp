let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarCarrito() {
    const cartDropdown = document.querySelector(".cart");
    cartDropdown.innerHTML = "";

    if (carrito.length === 0) {
        cartDropdown.innerHTML = "<p>Tu carrito está vacío.</p>";
        return;
    }

    carrito.forEach((producto, index) => {
        const item = document.createElement("div");
        item.classList.add("cart-item");
        item.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" width="50">
            <p>${producto.nombre} (Talla: ${producto.talla})</p>
            <p>$${producto.precio}</p>
            <button class="eliminar" data-index="${index}">Eliminar</button>
        `;
        cartDropdown.appendChild(item);
    });

    const total = carrito.reduce((sum, producto) => sum + parseFloat(producto.precio), 0);
    const totalElement = document.createElement("p");
    totalElement.textContent = `Total: $${total.toFixed(2)}`;
    cartDropdown.appendChild(totalElement);

    const finalizarCompra = document.createElement("button");
    finalizarCompra.textContent = "Finalizar compra";
    finalizarCompra.classList.add("finalizar-compra");
    cartDropdown.appendChild(finalizarCompra);

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
}

document.querySelectorAll(".add-to-cart").forEach((boton) => {
    boton.addEventListener("click", (e) => {
        const producto = {
            nombre: boton.dataset.name,
            precio: boton.dataset.price,
            imagen: boton.dataset.image,
        };

        const modal = document.getElementById("product-modal");
        const modalImage = document.getElementById("modal-image");
        const modalName = document.getElementById("modal-name");
        const modalPrice = document.getElementById("modal-price");
        const sizeSelect = document.getElementById("size");

        modalImage.src = producto.imagen;
        modalName.textContent = producto.nombre;
        modalPrice.textContent = `$${producto.precio}`;
        sizeSelect.innerHTML = JSON.parse(boton.dataset.sizes)
            .map((size) => `<option value="${size}">${size}</option>`)
            .join("");

        modal.style.display = "flex";

        const addToCartModal = document.getElementById("add-to-cart-modal");
        addToCartModal.onclick = () => {
            producto.talla = sizeSelect.value;
            agregarAlCarrito(producto);
            modal.style.display = "none";
        };

        document.querySelector(".close").onclick = () => {
            modal.style.display = "none";
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    });
});

document.querySelector(".cart").addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {
        const index = e.target.dataset.index;
        carrito.splice(index, 1);

        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarCarrito();
    }

    if (e.target.classList.contains("finalizar-compra")) {
        const total = carrito.reduce((sum, producto) => sum + parseFloat(producto.precio), 0);

        //para el formulario de paypal al finalizar compra
        const form = document.createElement("form");
        form.action = "https://www.paypal.com/cgi-bin/webscr";
        form.method = "post";
        form.target = "_blank";

        form.innerHTML = `
            <input type="hidden" name="cmd" value="_cart">
            <input type="hidden" name="upload" value="1">
            <input type="hidden" name="business" value="exoticsbears@gmail.com">
            <input type="hidden" name="currency_code" value="USD">
        `;

        
        carrito.forEach((producto, index) => {
            form.innerHTML += `
                <input type="hidden" name="item_name_${index + 1}" value="${producto.nombre}">
                <input type="hidden" name="amount_${index + 1}" value="${producto.precio}">
                <input type="hidden" name="quantity_${index + 1}" value="1">
            `;
        });

        
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        
        carrito = [];
        localStorage.removeItem("carrito");
        actualizarCarrito();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    actualizarCarrito();
});

