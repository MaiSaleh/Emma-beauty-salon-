import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

/* Gallery Lightbox */
const galleryImages = document.querySelectorAll(".gallery-item img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeLightbox = document.querySelector(".close-lightbox");

galleryImages.forEach((image) => {
  image.addEventListener("click", () => {
    lightbox.classList.add("show");
    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
  });
});

closeLightbox.addEventListener("click", () => {
  lightbox.classList.remove("show");
});

lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) {
    lightbox.classList.remove("show");
  }
});

/* Firebase Config */
const firebaseConfig = {
  apiKey: "AIzaSyDVt4EdRoEgYKjfLasg4r_FpgBg5saHLBw",

  authDomain: "emma-beauty-salon.firebaseapp.com",
  projectId: "emma-beauty-salon",
  storageBucket: "emma-beauty-salon.firebasestorage.app",
  messagingSenderId: "167354639455",
  appId: "1:167354639455:web:6965870ebc50e8f49427ea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Review Form */
const reviewForm = document.getElementById("review-form");
const reviewName = document.getElementById("review-name");
const reviewComment = document.getElementById("review-comment");
const reviewRating = document.getElementById("review-rating");
const reviewMessage = document.getElementById("review-message");
const reviewsContainer = document.getElementById("reviews-container");

if (reviewForm) {
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = reviewName.value.trim();
    const comment = reviewComment.value.trim();
    const rating = Number(reviewRating.value);

    if (!name || !comment || !rating || rating < 1 || rating > 5) {
      reviewMessage.textContent = "Please fill all fields correctly.";
      return;
    }

    try {
      await addDoc(collection(db, "reviews"), {
        name,
        comment,
        rating,
        createdAt: serverTimestamp()
      });

      reviewMessage.textContent = "Review submitted successfully!";
      reviewForm.reset();
    } catch (error) {
      console.error("Error adding review:", error);
      reviewMessage.textContent = "Something went wrong.";
    }
  });
}

/* Display Reviews */
if (reviewsContainer) {
  const reviewsQuery = query(
    collection(db, "reviews"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(reviewsQuery, (snapshot) => {
    reviewsContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const review = doc.data();

      const card = document.createElement("div");
      card.className = "testimonial-card";

     const fullStars = Math.round(review.rating);
const stars = "★".repeat(fullStars) + "☆".repeat(5 - fullStars);

card.innerHTML = `
  <p class="testimonial-text">"${review.comment}"</p>
  <h3>${review.name}</h3>
  <span>${stars}</span>
`

      reviewsContainer.appendChild(card);
    });
  });

}
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
}