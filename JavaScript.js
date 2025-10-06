// ======== IMPORT FIREBASE ======== //
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ======== FIREBASE CONFIG ======== //
const firebaseConfig = {
    apiKey: "AIzaSyB-eE_Edm7gd_nFmBQfP2V7OqBIJntZ4IQ",
    authDomain: "taste-haven-6c92d.firebaseapp.com",
    projectId: "taste-haven-6c92d",
    storageBucket: "taste-haven-6c92d.appspot.com",
    messagingSenderId: "999156594491",
    appId: "1:999156594491:web:345947308aeac9ab77291e",
    measurementId: "G-YLE10M2H9S"
};

// ======== INIT FIREBASE ======== //
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ======== DOM READY ======== //
document.addEventListener("DOMContentLoaded", async () => {
    const menuContainer = document.getElementById("menuContainer");
    const addForm = document.getElementById("addDishForm");
    const loginBtn = document.getElementById("loginBtn");

    // ---------- MENU PAGE ---------- //
    if (menuContainer) {
        await loadMenu();
    }

    // ---------- ADD DISH FORM ---------- //
    if (addForm) {
        addForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("dishName").value.trim();
            const price = document.getElementById("dishPrice").value.trim();
            const ingredients = document.getElementById("dishIngredients").value.trim();
            const category = document.getElementById("dishCategory").value.trim();

            if (!name || !price || !ingredients || !category) {
                alert("⚠️ Please fill in all fields!");
                return;
            }

            try {
                await addDoc(collection(db, "dishes"), {
                    name,
                    price,
                    ingredients,
                    category
                });
                alert(" Dish added successfully!");
                addForm.reset();
            } catch (error) {
                console.error(" Error adding dish: ", error);
                alert("Error adding dish. Check console.");
            }
        });
    }

    // ---------- OWNER LOGIN ---------- //
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const id = document.getElementById("ownerId").value.trim();
            const pass = document.getElementById("ownerPass").value.trim();

            const correctId = "admin123";
            const correctPass = "omar2025";

            if (id === correctId && pass === correctPass) {
                document.getElementById("login-section").style.display = "none";
                const addSection = document.getElementById("add-section");
                addSection.style.display = "flex";
                alert(" Login successful! You can now add dishes.");
            } else {
                alert(" Invalid ID or Password!");
            }
        });
    }
});

// ======== LOAD MENU FUNCTION ======== //
async function loadMenu() {
    const menuContainer = document.getElementById("menuContainer");
    if (!menuContainer) return;

    menuContainer.innerHTML = "<p>Loading menu...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "dishes"));
        menuContainer.innerHTML = "";

        if (querySnapshot.empty) {
            menuContainer.innerHTML = "<p>No dishes found yet.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const dish = doc.data();
            const item = document.createElement("div");
            item.classList.add("menu-item");
            item.innerHTML = `
                <h3>${dish.name}</h3>
                <p>${dish.ingredients}</p>
                <strong>${dish.price} EGP</strong><br>
                <span style="color:#666; font-size:13px;">(${dish.category})</span>
            `;
            menuContainer.appendChild(item);
        });
    } catch (error) {
        console.error("❌ Error loading menu:", error);
        menuContainer.innerHTML = "<p>Error loading menu.</p>";
    }
}

