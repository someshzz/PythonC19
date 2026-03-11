## WSGI and ASGI

Both are Python web server interface standards — essentially the contract between a web server (like Nginx) and a Python web application.

<b>WSGI (Web Server Gateway Interface)</b> <i>Old</i>
- Does not support aynchronous
- To support Asynchronous, manual multithreading is needed
- Single Thread (like Node.js)
- Tool used: Gunicorn
- Very mature and a robust tech

<b>ASGI (Asynchronous Server Gateway Interface)</b> <i>New</i>
- Supports Asynchronous
- Comes out of the box
- Event Loop
- Tool used: uvicorn
- Less mature but used very widely (available after 2020)