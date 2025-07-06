// comments.js (versi final fix)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  increment,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPnUlsY-QZIfPXbkrXiqOcXzrGWV7qJ14",
  authDomain: "portofolio-js.firebaseapp.com",
  projectId: "portofolio-js",
  storageBucket: "portofolio-js.appspot.com",
  messagingSenderId: "239757466800",
  appId: "1:239757466800:web:c4e14b5eecec815862af75",
  measurementId: "G-SX6VKD8C3N",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const commentNameInput = document.getElementById("comment-name");
const commentTextInput = document.getElementById("comment-text");
const submitCommentButton = document.getElementById("submit-comment-button");
const commentsList = document.getElementById("comments-list");

submitCommentButton.addEventListener("click", async () => {
  const name = commentNameInput.value.trim() || "Anonim";
  const commentText = commentTextInput.value.trim();
  if (!commentText) return alert("Komentar tidak boleh kosong!");

  try {
    await addDoc(collection(db, "comments"), {
      name,
      commentText,
      timestamp: serverTimestamp(),
      likes: 0,
      dislikes: 0,
      replies: [],
    });
    commentNameInput.value = "";
    commentTextInput.value = "";
  } catch (e) {
    alert("Gagal mengirim komentar.");
  }
});

function renderComment(comment, id) {
  const div = document.createElement("div");
  const date =
    comment.timestamp?.toDate().toLocaleString("id-ID") || "Baru saja";
  div.className = "comment-item bg-gray-700 p-4 rounded-lg shadow-md mb-4";
  div.innerHTML = `
    <p class='text-blue-300 font-bold'>user: ${comment.name}</p>
    <p class='text-white'>komentar: ${comment.commentText}</p>
    <small class='text-gray-400'>${date}</small>
    <div class='flex gap-2 mt-2'>
      <button class='like-button' data-id='${id}' data-type='comment'>👍 ${
    comment.likes || 0
  }</button>
      <button class='dislike-button' data-id='${id}' data-type='comment'>👎 ${
    comment.dislikes || 0
  }</button>
      <button class='reply-toggle-button' data-id='${id}'>💬 Balas</button>
    </div>
    <div class="reply-form hidden mt-2">
  <input
    class="reply-name w-full p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring focus:ring-purple-400"
    placeholder="Nama (opsional)"
  />
  <textarea
    class="reply-text w-full mt-2 p-2 rounded bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring focus:ring-purple-400"
    placeholder="Tulis balasan Anda..."
  ></textarea>
  <button
    class="submit-reply mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
    data-id="${id}"
  >
    Kirim
  </button>
</div>
<div class="replies mt-2"></div>

  `;

  const repliesDiv = div.querySelector(".replies");
  (comment.replies || []).forEach((r) => {
    const replyDiv = document.createElement("div");
    replyDiv.className = "ml-4 text-sm border-l border-gray-500 pl-2 mt-1";
    replyDiv.innerHTML = `
      <p class='text-black-300'>user: ${r.name}</p>
      <p>komentar: ${r.commentText}</p>
    `;
    repliesDiv.appendChild(replyDiv);
  });
  return div;
}

onSnapshot(
  query(collection(db, "comments"), orderBy("timestamp", "desc")),
  (snap) => {
    commentsList.innerHTML = "";
    snap.forEach((docSnap) => {
      const el = renderComment(docSnap.data(), docSnap.id);
      commentsList.appendChild(el);
    });
    setupListeners();
  }
);

function setupListeners() {
  document.querySelectorAll(".reply-toggle-button").forEach((btn) => {
    btn.onclick = () => {
      btn.parentElement.nextElementSibling.classList.toggle("hidden");
    };
  });

  document.querySelectorAll(".submit-reply").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const form = btn.closest(".reply-form");
      const name = form.querySelector(".reply-name").value.trim() || "Anonim";
      const text = form.querySelector(".reply-text").value.trim();
      if (!text) return alert("Balasan kosong");

      const ref = doc(db, "comments", id);
      const snap = await getDoc(ref);
      const replies = snap.data().replies || [];
      replies.push({
        id: crypto.randomUUID(),
        name,
        commentText: text,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0,
      });
      await updateDoc(ref, { replies });
      form.classList.add("hidden");
    };
  });

  document.querySelectorAll(".like-button, .dislike-button").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const type = btn.dataset.type;
      const action = btn.classList.contains("like-button") ? "like" : "dislike";
      const likeKey = `${id}-like`;
      const dislikeKey = `${id}-dislike`;

      const ref = doc(db, "comments", id);
      const snap = await getDoc(ref);
      const data = snap.data();

      if (action === "like") {
        if (localStorage.getItem(likeKey)) {
          await updateDoc(ref, { likes: increment(-1) });
          localStorage.removeItem(likeKey);
        } else {
          await updateDoc(ref, { likes: increment(1) });
          localStorage.setItem(likeKey, "true");
          if (localStorage.getItem(dislikeKey)) {
            await updateDoc(ref, { dislikes: increment(-1) });
            localStorage.removeItem(dislikeKey);
          }
        }
      } else {
        if (localStorage.getItem(dislikeKey)) {
          await updateDoc(ref, { dislikes: increment(-1) });
          localStorage.removeItem(dislikeKey);
        } else {
          await updateDoc(ref, { dislikes: increment(1) });
          localStorage.setItem(dislikeKey, "true");
          if (localStorage.getItem(likeKey)) {
            await updateDoc(ref, { likes: increment(-1) });
            localStorage.removeItem(likeKey);
          }
        }
      }
    };
  });
}
