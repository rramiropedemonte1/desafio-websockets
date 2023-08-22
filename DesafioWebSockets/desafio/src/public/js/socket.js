const socket = io();

socket.on("saludo", (data) => {
  console.log(`su cliente ha sido conectado: ${data}`);
});

socket.on("listProducts", (data) => {
  refreshProducts(data);
});

function refreshProducts(data) {
  const log = document.getElementById("log");
  log.innerHTML = "";
  data.forEach((i) => {
    log.innerHTML += `
          <ul id=${i.id}>
      <li><b>ID: </b>${i.id}</li>
      <li><b>Titulo: </b>${i.title}</li>
      <li><b>Descripcion: </b>${i.description}</li>
      <li><b>Precio: </b>${i.price}</li>
      <li><b>Categoria: </b>${i.category}</li>
      <li><b>Stock: </b>${i.stock}</li>
    </ul>
    `;
  });
}
