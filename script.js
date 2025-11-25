// Sistema de autenticación
let currentUser = null;
const users = JSON.parse(localStorage.getItem('powermill_users')) || [];

// Elementos de autenticación
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const userName = document.getElementById('user-name');
const userAvatar = document.getElementById('user-avatar');

// Mostrar formulario de registro
showRegister.addEventListener('click', function(e) {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

// Mostrar formulario de login
showLogin.addEventListener('click', function(e) {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Procesar login
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Verificar credenciales
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('powermill_current_user', JSON.stringify(user));
        showDashboard();
    } else {
        alert('Credenciales incorrectas. Intente nuevamente.');
    }
});

// Procesar registro
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // Validaciones
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        alert('Este correo electrónico ya está registrado.');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };
    
    users.push(newUser);
    localStorage.setItem('powermill_users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('powermill_current_user', JSON.stringify(newUser));
    
    alert('Cuenta creada exitosamente. Bienvenido a Power Mill!');
    showDashboard();
});

// Cerrar sesión
logoutBtn.addEventListener('click', function() {
    currentUser = null;
    localStorage.removeItem('powermill_current_user');
    showAuth();
});

// Mostrar dashboard
function showDashboard() {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    
    // Actualizar información del usuario
    userName.textContent = currentUser.name;
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=2c5aa0&color=fff`;
    
    // Inicializar dashboard
    initializeDashboard();
}

// Mostrar autenticación
function showAuth() {
    dashboardSection.classList.add('hidden');
    authSection.classList.remove('hidden');
    
    // Limpiar formularios
    loginForm.reset();
    registerForm.reset();
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

// Verificar si hay usuario logueado al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('powermill_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
    } else {
        showAuth();
    }
});

// Datos de ejemplo
const sampleOrders = [
    { id: 1, client: "María González", product: "Leche Entera (1L)", quantity: 5, date: "2023-05-15", status: "completed" },
    { id: 2, client: "Carlos López", product: "Yogurt Natural (500g)", quantity: 10, date: "2023-05-16", status: "pending" },
    { id: 3, client: "Ana Martínez", product: "Queso Fresco (250g)", quantity: 3, date: "2023-05-16", status: "pending" },
    { id: 4, client: "Pedro Ramírez", product: "Mantequilla (200g)", quantity: 8, date: "2023-05-14", status: "completed" },
    { id: 5, client: "Laura Sánchez", product: "Crema de Leche (250ml)", quantity: 2, date: "2023-05-17", status: "cancelled" }
];

const sampleProducts = [
    { id: 1, name: "Leche Entera (1L)", category: "leche", price: 85.00, stock: 150, icon: "fa-wine-bottle" },
    { id: 2, name: "Yogurt Natural (500g)", category: "yogurt", price: 110.00, stock: 80, icon: "fa-blender" },
    { id: 3, name: "Queso Fresco (250g)", category: "queso", price: 165.00, stock: 45, icon: "fa-cheese" },
    { id: 4, name: "Mantequilla (200g)", category: "mantequilla", price: 100.00, stock: 60, icon: "fa-cube" },
    { id: 5, name: "Crema de Leche (250ml)", category: "crema", price: 120.00, stock: 30, icon: "fa-fill-drip" }
];

const sampleClients = [
    { id: 1, name: "María González", email: "maria@example.com", phone: "+505 8888 8888", address: "Calle Principal #123, Managua", orders: 12 },
    { id: 2, name: "Carlos López", email: "carlos@example.com", phone: "+505 8888 8889", address: "Av. Central #456, Granada", orders: 8 },
    { id: 3, name: "Ana Martínez", email: "ana@example.com", phone: "+505 8888 8890", address: "Plaza Mayor #789, León", orders: 5 },
    { id: 4, name: "Pedro Ramírez", email: "pedro@example.com", phone: "+505 8888 8891", address: "Boulevard Norte #321, Masaya", orders: 15 }
];

// Variables para almacenar las instancias de gráficos
let charts = {};

// Función para inicializar el dashboard
function initializeDashboard() {
    // Inicializar datos
    renderOrdersTable(sampleOrders);
    renderRecentOrdersTable(sampleOrders);
    renderProductsGrid(sampleProducts);
    renderClientsList(sampleClients);
    
    // Inicializar gráficas
    initializeCharts();
    
    // Configurar navegación
    document.querySelectorAll('.nav-links li').forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            changeSection(sectionId);
        });
    });
    
    // Configurar menú móvil
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic fuera de él en móviles
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (window.innerWidth <= 768 && 
            !sidebar.contains(event.target) && 
            !menuToggle.contains(event.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}

// Función para inicializar gráficas
function initializeCharts() {
    // Datos para las gráficas
    const productSalesData = {
        labels: ['Leche Entera', 'Yogurt Natural', 'Queso Fresco', 'Mantequilla', 'Crema de Leche'],
        datasets: [{
            label: 'Ventas (C$)',
            data: [42500, 35200, 24750, 21600, 14400],
            backgroundColor: [
                'rgba(44, 90, 160, 0.7)',
                'rgba(76, 175, 80, 0.7)',
                'rgba(243, 156, 18, 0.7)',
                'rgba(231, 76, 60, 0.7)',
                'rgba(155, 89, 182, 0.7)'
            ],
            borderColor: [
                'rgba(44, 90, 160, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(243, 156, 18, 1)',
                'rgba(231, 76, 60, 1)',
                'rgba(155, 89, 182, 1)'
            ],
            borderWidth: 1
        }]
    };

    const orderStatusData = {
        labels: ['Completados', 'Pendientes', 'Cancelados'],
        datasets: [{
            data: [115, 24, 3],
            backgroundColor: [
                'rgba(76, 175, 80, 0.7)',
                'rgba(243, 156, 18, 0.7)',
                'rgba(231, 76, 60, 0.7)'
            ],
            borderColor: [
                'rgba(76, 175, 80, 1)',
                'rgba(243, 156, 18, 1)',
                'rgba(231, 76, 60, 1)'
            ],
            borderWidth: 1
        }]
    };

    const monthlyTrendData = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
            label: 'Pedidos',
            data: [120, 135, 142, 138, 156, 142],
            borderColor: 'rgba(44, 90, 160, 1)',
            backgroundColor: 'rgba(44, 90, 160, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }, {
            label: 'Ventas (C$)',
            data: [33600, 37800, 42450, 37200, 46800, 42450],
            borderColor: 'rgba(76, 175, 80, 1)',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    };

    const clientsByRegionData = {
        labels: ['Managua', 'Granada', 'León', 'Masaya', 'Carazo'],
        datasets: [{
            label: 'Clientes',
            data: [45, 32, 28, 25, 40],
            backgroundColor: [
                'rgba(44, 90, 160, 0.7)',
                'rgba(76, 175, 80, 0.7)',
                'rgba(243, 156, 18, 0.7)',
                'rgba(231, 76, 60, 0.7)',
                'rgba(155, 89, 182, 0.7)'
            ],
            borderColor: [
                'rgba(44, 90, 160, 1)',
                'rgba(76, 175, 80, 1)',
                'rgba(243, 156, 18, 1)',
                'rgba(231, 76, 60, 1)',
                'rgba(155, 89, 182, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Destruir gráficas existentes si las hay
    if (charts.productSales) charts.productSales.destroy();
    if (charts.orderStatus) charts.orderStatus.destroy();
    if (charts.monthlyTrend) charts.monthlyTrend.destroy();
    if (charts.clientsByRegion) charts.clientsByRegion.destroy();
    if (charts.dashboardSales) charts.dashboardSales.destroy();
    if (charts.dashboardOrders) charts.dashboardOrders.destroy();

    // Gráfica de ventas por producto (Dashboard)
    const salesByProductCtx = document.getElementById('salesByProductChart').getContext('2d');
    charts.dashboardSales = new Chart(salesByProductCtx, {
        type: 'bar',
        data: productSalesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfica de pedidos por estado (Dashboard)
    const ordersByStatusCtx = document.getElementById('ordersByStatusChart').getContext('2d');
    charts.dashboardOrders = new Chart(ordersByStatusCtx, {
        type: 'doughnut',
        data: orderStatusData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfica de ventas por producto (Reportes)
    const productSalesCtx = document.getElementById('productSalesChart').getContext('2d');
    charts.productSales = new Chart(productSalesCtx, {
        type: 'bar',
        data: productSalesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfica de pedidos por estado (Reportes)
    const orderStatusCtx = document.getElementById('orderStatusChart').getContext('2d');
    charts.orderStatus = new Chart(orderStatusCtx, {
        type: 'pie',
        data: orderStatusData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Gráfica de tendencia mensual
    const monthlyTrendCtx = document.getElementById('monthlyTrendChart').getContext('2d');
    charts.monthlyTrend = new Chart(monthlyTrendCtx, {
        type: 'line',
        data: monthlyTrendData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfica de clientes por región
    const clientsByRegionCtx = document.getElementById('clientsByRegionChart').getContext('2d');
    charts.clientsByRegion = new Chart(clientsByRegionCtx, {
        type: 'polarArea',
        data: clientsByRegionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Función para cambiar de sección
function changeSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).classList.add('active');
    
    // Actualizar el título de la página
    const titles = {
        'dashboard': 'Dashboard - Administrador de Pedidos',
        'orders': 'Gestión de Pedidos',
        'products': 'Gestión de Productos',
        'clients': 'Gestión de Clientes',
        'reports': 'Reportes y Estadísticas',
        'settings': 'Configuración del Sistema'
    };
    
    document.getElementById('page-title').textContent = titles[sectionId];
    
    // Actualizar la navegación activa
    document.querySelectorAll('.nav-links li').forEach(item => {
        item.classList.remove('active');
    });
    
    document.querySelector(`.nav-links li[data-section="${sectionId}"]`).classList.add('active');
    
    // Reinicializar gráficas si se cambia a la sección de reportes
    if (sectionId === 'reports' || sectionId === 'dashboard') {
        setTimeout(initializeCharts, 100);
    }
    
    // Cerrar el menú en móviles
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

// Función para renderizar la tabla de pedidos
function renderOrdersTable(orders) {
    const tableBody = document.getElementById('orders-table');
    tableBody.innerHTML = '';
    
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.client}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td>${order.date}</td>
            <td><span class="status ${order.status}">${getStatusText(order.status)}</span></td>
            <td>
                <button class="action-btn edit-btn" onclick="editOrder(${order.id})"><i class="fas fa-edit"></i> Editar</button>
                <button class="action-btn delete-btn" onclick="deleteOrder(${order.id})"><i class="fas fa-trash"></i> Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para renderizar pedidos recientes
function renderRecentOrdersTable(orders) {
    const tableBody = document.getElementById('recent-orders-table');
    tableBody.innerHTML = '';
    
    // Mostrar solo los últimos 5 pedidos
    const recentOrders = orders.slice(-5);
    
    recentOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.client}</td>
            <td>${order.product}</td>
            <td>${order.quantity}</td>
            <td>${order.date}</td>
            <td><span class="status ${order.status}">${getStatusText(order.status)}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para renderizar productos
function renderProductsGrid(products) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Categoría: ${getCategoryText(product.category)}</p>
                <p class="product-price">C$ ${product.price.toFixed(2)}</p>
                <p>Stock: ${product.stock} unidades</p>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Función para renderizar clientes
function renderClientsList(clients) {
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = '';
    
    clients.forEach(client => {
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        
        // Obtener iniciales para el avatar
        const initials = client.name.split(' ').map(n => n[0]).join('');
        
        clientCard.innerHTML = `
            <div class="client-header">
                <div class="client-avatar">${initials}</div>
                <div>
                    <h3>${client.name}</h3>
                    <p>${client.email}</p>
                </div>
            </div>
            <p><strong>Teléfono:</strong> ${client.phone}</p>
            <p><strong>Dirección:</strong> ${client.address}</p>
            <p><strong>Pedidos realizados:</strong> ${client.orders}</p>
        `;
        clientList.appendChild(clientCard);
    });
}

// Función para obtener el texto del estado
function getStatusText(status) {
    switch(status) {
        case 'pending': return 'Pendiente';
        case 'completed': return 'Completado';
        case 'cancelled': return 'Cancelado';
        default: return status;
    }
}

// Función para obtener el texto de la categoría
function getCategoryText(category) {
    switch(category) {
        case 'leche': return 'Leche';
        case 'yogurt': return 'Yogurt';
        case 'queso': return 'Queso';
        case 'mantequilla': return 'Mantequilla';
        case 'crema': return 'Crema';
        default: return category;
    }
}

// Función para agregar un nuevo pedido
document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clientName = document.getElementById('client-name').value;
    const product = document.getElementById('product').value;
    const quantity = document.getElementById('quantity').value;
    const status = document.getElementById('status').value;
    
    // Obtener el texto del producto seleccionado
    const productSelect = document.getElementById('product');
    const productText = productSelect.options[productSelect.selectedIndex].text;
    
    // Crear nuevo pedido
    const newOrder = {
        id: sampleOrders.length + 1,
        client: clientName,
        product: productText,
        quantity: quantity,
        date: new Date().toISOString().split('T')[0],
        status: status
    };
    
    // Agregar a la lista
    sampleOrders.push(newOrder);
    
    // Actualizar las tablas
    renderOrdersTable(sampleOrders);
    renderRecentOrdersTable(sampleOrders);
    
    // Resetear el formulario
    document.getElementById('order-form').reset();
    
    // Actualizar gráficas
    initializeCharts();
    
    // Mostrar mensaje de éxito
    alert('Pedido agregado correctamente');
});

// Función para agregar un nuevo producto
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const productName = document.getElementById('product-name').value;
    const productCategory = document.getElementById('product-category').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productStock = parseInt(document.getElementById('product-stock').value);
    
    // Obtener icono según categoría
    const icons = {
        'leche': 'fa-wine-bottle',
        'yogurt': 'fa-blender',
        'queso': 'fa-cheese',
        'mantequilla': 'fa-cube',
        'crema': 'fa-fill-drip'
    };
    
    // Crear nuevo producto
    const newProduct = {
        id: sampleProducts.length + 1,
        name: productName,
        category: productCategory,
        price: productPrice,
        stock: productStock,
        icon: icons[productCategory] || 'fa-box'
    };
    
    // Agregar a la lista
    sampleProducts.push(newProduct);
    
    // Actualizar la lista de productos
    renderProductsGrid(sampleProducts);
    
    // Resetear el formulario
    document.getElementById('product-form').reset();
    
    // Mostrar mensaje de éxito
    alert('Producto agregado correctamente');
});

// Función para agregar un nuevo cliente
document.getElementById('client-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const clientName = document.getElementById('client-fullname').value;
    const clientEmail = document.getElementById('client-email').value;
    const clientPhone = document.getElementById('client-phone').value;
    const clientAddress = document.getElementById('client-address').value;
    
    // Crear nuevo cliente
    const newClient = {
        id: sampleClients.length + 1,
        name: clientName,
        email: clientEmail,
        phone: clientPhone,
        address: clientAddress,
        orders: 0
    };
    
    // Agregar a la lista
    sampleClients.push(newClient);
    
    // Actualizar la lista de clientes
    renderClientsList(sampleClients);
    
    // Resetear el formulario
    document.getElementById('client-form').reset();
    
    // Mostrar mensaje de éxito
    alert('Cliente agregado correctamente');
});

// Función para editar un pedido
function editOrder(id) {
    const order = sampleOrders.find(o => o.id === id);
    if (order) {
        // Cambiar a la sección de pedidos
        changeSection('orders');
        
        // Llenar el formulario con los datos del pedido
        document.getElementById('client-name').value = order.client;
        
        // Buscar la opción del producto que coincida
        const productSelect = document.getElementById('product');
        for (let i = 0; i < productSelect.options.length; i++) {
            if (productSelect.options[i].text === order.product) {
                productSelect.selectedIndex = i;
                break;
            }
        }
        
        document.getElementById('quantity').value = order.quantity;
        document.getElementById('status').value = order.status;
        
        // Eliminar el pedido de la lista para luego agregarlo actualizado
        const index = sampleOrders.findIndex(o => o.id === id);
        sampleOrders.splice(index, 1);
        
        // Actualizar las tablas
        renderOrdersTable(sampleOrders);
        renderRecentOrdersTable(sampleOrders);
        
        alert(`Editando pedido #${id}. Complete los cambios y haga clic en "Agregar Pedido"`);
    }
}

// Función para eliminar un pedido
function deleteOrder(id) {
    if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
        const index = sampleOrders.findIndex(o => o.id === id);
        if (index !== -1) {
            sampleOrders.splice(index, 1);
            renderOrdersTable(sampleOrders);
            renderRecentOrdersTable(sampleOrders);
            initializeCharts();
            alert('Pedido eliminado correctamente');
        }
    }
}