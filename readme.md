1 -> cd D:\
    git clone https://github.com/RavishGautam/meri-train.git
    cd meri-train

2-> git status

3-> npm create vite@latest frontend -- --template react

4-> cd frontend
    npm install 

5-> npm install tailwindcss @tailwindcss/vite

    5.1 - in vite.config.js -> import tailwind and put tailwind() in plugins array.

    5.2 - import tailwind  in index.css  -- > @import "tailwindcss";


6 -> cd .. (back to meri-train)
7 -> (create a backend folder)
    mkdir backend
        cd backend
            npm init -y
            npm install express cors dotenv helmet morgan
            npm install -D nodemon


