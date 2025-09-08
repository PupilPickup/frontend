# Pupil Pickup 🚗  
Pupil Pickup is a **ride-sharing platform for school parents in Nepal**, designed to reduce traffic congestion and absenteeism by facilitating carpooling.  

## 🌟 Features  
- Find and share rides with other parents  
- View available carpool options  
- Easy and secure ride coordination  

## 🛠️ Tech Stack  
- **Frontend**: React + TypeScript + Tailwind CSS  + Leaflet + OpenStreetMap

## 🚀 Getting Started  

1. **Clone the repository** (if you haven't already):  
   ```sh
   git clone <your-repository-url>
   cd pupil-pickup-client
   ```

2. **Install dependencies** (if you haven't already):
   ```sh
   npm install
   ```
3. **Create .env file at root directory** 
(if your backend runs on 5000, copy paste the following code; if not, change accordingly) 
(switch between if running on local backend server or live server on Render) :
   ```sh
   REACT_APP_API_BASE_URL=http://localhost:5000
   # or
   REACT_APP_API_BASE_URL=https://pupil-pickup-backend-api.onrender.com 

   # Role-based authentication
   ROLE_ADMIN=1
   ROLE_PARENT=2
   ROLE_DRIVER=3
   ROLE_PENDING_PARENT=4
   ROLE_PENDING_DRIVER=5
   ROLE_ROLELESS_USER=6
   ROLE_REJECTED_PARENT=7
   ROLE_REJECTED_DRIVER=8
   ```

4. **Start the development server**
   ```sh
   npm run dev
   ```

## 🤝 Contributing & Deployment
-Create changes on new branches (e.g., feature/new-component, fix/bug-description), then open a PR into the development branch.

-Before the sprint ends, the development branch will be merged into main.

-The frontend is hosted on Netlify. Any update to main will trigger automatic formatting and deployment.
