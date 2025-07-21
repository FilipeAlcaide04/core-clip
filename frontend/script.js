// Global state
let currentSection = "home"
let flashcards = []
let currentCardIndex = 0
let studySession = false
let uploadedDocuments = []

// Theme management
const themeToggle = document.getElementById("themeToggle")
const body = document.body

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)

  const icon = themeToggle.querySelector("i")
  icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon"
})

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "dark"
body.setAttribute("data-theme", savedTheme)
if (savedTheme === "dark") {
  themeToggle.querySelector("i").className = "fas fa-sun"
}

// Navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show target section
  document.getElementById(sectionId).classList.add("active")

  // Update nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })

  document.querySelector(`[data-section="${sectionId}"]`).classList.add("active")
  currentSection = sectionId
}

// Navigation event listeners
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    const section = link.getAttribute("data-section")
    showSection(section)
  })
})

// YouTube functionality
async function processYouTubeVideo() {
  const urlInput = document.getElementById("youtubeUrl")
  const url = urlInput.value.trim()

  if (!url) {
    alert("Please enter a YouTube URL")
    return
  }

  if (!isValidYouTubeUrl(url)) {
    alert("Please enter a valid YouTube URL")
    return
  }

  showLoading("youtubeLoading")

  // Simulate API call delay
  setTimeout(() => {
    const videoData = generateMockVideoData(url)
    displayVideoResult(videoData)
    hideLoading("youtubeLoading")
  }, 2000)
}

function isValidYouTubeUrl(url) {
  const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
  return regex.test(url)
}

function generateMockVideoData(url) {
  const videoId = extractVideoId(url)
  return {
    id: videoId,
    title: "Introduction to Machine Learning - Complete Course",
    channel: "Tech Education Hub",
    duration: "2:45:30",
    thumbnail: `/placeholder.svg?height=120&width=200`,
    keyPoints: [
      "Machine learning is a subset of artificial intelligence",
      "Supervised learning uses labeled training data",
      "Unsupervised learning finds patterns in unlabeled data",
      "Neural networks mimic the human brain structure",
      "Deep learning uses multiple layers of neural networks",
    ],
    summary:
      "This comprehensive course covers the fundamentals of machine learning, including supervised and unsupervised learning techniques. The instructor explains key concepts like neural networks, deep learning, and practical applications in various industries. Perfect for beginners looking to understand AI and ML concepts.",
  }
}

function extractVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : "dQw4w9WgXcQ"
}

function displayVideoResult(data) {
  const resultDiv = document.getElementById("videoResult")

  document.getElementById("videoThumbnail").src = data.thumbnail
  document.getElementById("videoTitle").textContent = data.title
  document.getElementById("videoChannel").textContent = data.channel
  document.getElementById("videoDuration").textContent = data.duration

  const keyPointsList = document.getElementById("keyPoints")
  keyPointsList.innerHTML = ""
  data.keyPoints.forEach((point) => {
    const li = document.createElement("li")
    li.textContent = point
    keyPointsList.appendChild(li)
  })

  document.getElementById("videoSummary").textContent = data.summary

  resultDiv.classList.remove("hidden")

  // Store data for flashcard generation
  window.currentVideoData = data
}

function generateFlashcards() {
  if (!window.currentVideoData) {
    alert("Please process a video first")
    return
  }

  const videoData = window.currentVideoData
  flashcards = [
    {
      question: "What is machine learning?",
      answer:
        "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed.",
    },
    {
      question: "What is supervised learning?",
      answer:
        "Supervised learning is a type of machine learning that uses labeled training data to learn patterns and make predictions on new, unseen data.",
    },
    {
      question: "What is the difference between supervised and unsupervised learning?",
      answer:
        "Supervised learning uses labeled data to train models, while unsupervised learning finds patterns in unlabeled data without predefined outcomes.",
    },
    {
      question: "What are neural networks?",
      answer:
        "Neural networks are computing systems inspired by biological neural networks, consisting of interconnected nodes that process information.",
    },
    {
      question: "What is deep learning?",
      answer:
        "Deep learning is a subset of machine learning that uses neural networks with multiple layers to learn complex patterns in data.",
    },
  ]

  showSection("flashcards")
  alert("Flashcards generated successfully! Go to the Flashcards section to start studying.")
}

function saveToLibrary() {
  if (!window.currentVideoData) {
    alert("No video data to save")
    return
  }

  // Simulate saving to library
  alert("Video saved to your library successfully!")
}

// Flashcard functionality
function startStudySession() {
  if (flashcards.length === 0) {
    alert("No flashcards available. Please generate flashcards from a YouTube video first.")
    return
  }

  studySession = true
  currentCardIndex = 0
  updateFlashcard()
  document.getElementById("flashcardActions").classList.remove("hidden")
  updateProgress()
}

function updateFlashcard() {
  if (flashcards.length === 0) return

  const card = flashcards[currentCardIndex]
  const flashcard = document.getElementById("flashcard")

  // Reset flip state
  flashcard.classList.remove("flipped")

  // Update content
  const front = flashcard.querySelector(".flashcard-front .card-content")
  const back = flashcard.querySelector(".flashcard-back .card-content")

  front.innerHTML = `<h3>Question ${currentCardIndex + 1}</h3><p>${card.question}</p>`
  back.innerHTML = `<h3>Answer</h3><p>${card.answer}</p>`

  updateProgress()
}

function flipCard() {
  const flashcard = document.getElementById("flashcard")
  flashcard.classList.toggle("flipped")
}

function nextCard() {
  if (currentCardIndex < flashcards.length - 1) {
    currentCardIndex++
    updateFlashcard()
  } else {
    alert("You've completed all flashcards! Great job!")
    studySession = false
    document.getElementById("flashcardActions").classList.add("hidden")
  }
}

function markCorrect() {
  // Add to correct pile logic here
  nextCard()
}

function markIncorrect() {
  // Add to incorrect pile logic here
  nextCard()
}

function shuffleCards() {
  if (flashcards.length === 0) {
    alert("No flashcards to shuffle")
    return
  }

  for (let i = flashcards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]]
  }

  if (studySession) {
    currentCardIndex = 0
    updateFlashcard()
  }

  alert("Flashcards shuffled!")
}

function updateProgress() {
  const progressText = document.getElementById("cardProgress")
  const progressFill = document.getElementById("progressFill")

  if (flashcards.length > 0) {
    progressText.textContent = `${currentCardIndex + 1} / ${flashcards.length}`
    const percentage = ((currentCardIndex + 1) / flashcards.length) * 100
    progressFill.style.width = `${percentage}%`
  } else {
    progressText.textContent = "0 / 0"
    progressFill.style.width = "0%"
  }
}

// Chat functionality
function sendMessage() {
  const input = document.getElementById("chatInput")
  const message = input.value.trim()

  if (!message) return

  addMessage(message, "user")
  input.value = ""

  // Simulate AI response
  setTimeout(() => {
    const response = generateAIResponse(message)
    addMessage(response, "ai")
  }, 1000)
}

function sendQuickMessage(message) {
  document.getElementById("chatInput").value = message
  sendMessage()
}

function addMessage(content, sender) {
  const messagesContainer = document.getElementById("chatMessages")
  const messageDiv = document.createElement("div")
  messageDiv.className = `message ${sender}-message`

  const avatar = document.createElement("div")
  avatar.className = "message-avatar"
  avatar.innerHTML = sender === "ai" ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>'

  const messageContent = document.createElement("div")
  messageContent.className = "message-content"
  messageContent.innerHTML = `<p>${content}</p>`

  messageDiv.appendChild(avatar)
  messageDiv.appendChild(messageContent)
  messagesContainer.appendChild(messageDiv)

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

function generateAIResponse(userMessage) {
  const responses = {
    "explain quantum physics":
      "Quantum physics is the branch of physics that studies matter and energy at the smallest scales. Key principles include wave-particle duality, uncertainty principle, and quantum entanglement. Would you like me to explain any specific concept in more detail?",
    "create a math quiz":
      "Here's a quick math quiz for you:\n\n1. What is 15 × 8?\n2. Solve for x: 2x + 5 = 17\n3. What is the area of a circle with radius 4?\n\nWould you like me to provide the answers or create more questions?",
    "study tips for exams":
      "Here are some effective study tips:\n\n• Use active recall instead of just re-reading\n• Practice spaced repetition\n• Create a study schedule and stick to it\n• Take regular breaks (Pomodoro technique)\n• Teach concepts to others\n• Get enough sleep and exercise\n\nWhich area would you like me to elaborate on?",
    "help with essay writing":
      "Here's a structured approach to essay writing:\n\n1. **Planning**: Brainstorm ideas and create an outline\n2. **Introduction**: Hook, background, thesis statement\n3. **Body**: Each paragraph should have one main idea with evidence\n4. **Conclusion**: Summarize key points and restate thesis\n5. **Revision**: Check for clarity, flow, and grammar\n\nWhat type of essay are you working on?",
  }

  const lowerMessage = userMessage.toLowerCase()

  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key.toLowerCase())) {
      return response
    }
  }

  // Default response
  return `I understand you're asking about "${userMessage}". I'm here to help with your studies! I can assist with explanations, create practice questions, provide study strategies, and help with various academic topics. Could you be more specific about what you'd like to learn or practice?`
}

// Chat input event listener
document.getElementById("chatInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
})

// Document upload functionality
function setupDocumentUpload() {
  const uploadArea = document.getElementById("uploadArea")
  const fileInput = document.getElementById("fileInput")

  // Drag and drop events
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.classList.add("dragover")
  })

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover")
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("dragover")
    const files = e.dataTransfer.files
    handleFileUpload(files)
  })

  // Click to upload
  uploadArea.addEventListener("click", () => {
    fileInput.click()
  })

  fileInput.addEventListener("change", (e) => {
    handleFileUpload(e.target.files)
  })
}

function handleFileUpload(files) {
  Array.from(files).forEach((file) => {
    if (validateFile(file)) {
      uploadedDocuments.push({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
      })

      displayDocument(uploadedDocuments[uploadedDocuments.length - 1])
    }
  })
}

function validateFile(file) {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ]
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!allowedTypes.includes(file.type)) {
    alert(`File type ${file.type} is not supported. Please upload PDF, DOC, DOCX, or TXT files.`)
    return false
  }

  if (file.size > maxSize) {
    alert("File size must be less than 10MB")
    return false
  }

  return true
}

function displayDocument(doc) {
  const documentList = document.getElementById("documentList")
  const docDiv = document.createElement("div")
  docDiv.className = "document-item"
  docDiv.innerHTML = `
        <div class="document-info">
            <div class="document-icon">
                <i class="fas fa-file-${getFileIcon(doc.type)}"></i>
            </div>
            <div class="document-details">
                <h4>${doc.name}</h4>
                <p>${formatFileSize(doc.size)} • Uploaded ${formatDate(doc.uploadDate)}</p>
            </div>
        </div>
        <div class="document-actions">
            <button class="btn btn-outline" onclick="analyzeDocument('${doc.id}')">
                <i class="fas fa-search"></i>
                Analyze
            </button>
            <button class="btn btn-danger" onclick="removeDocument('${doc.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `

  documentList.appendChild(docDiv)
}

function getFileIcon(type) {
  if (type.includes("pdf")) return "pdf"
  if (type.includes("word")) return "word"
  if (type.includes("text")) return "alt"
  return "file"
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function formatDate(date) {
  return date.toLocaleDateString()
}

function analyzeDocument(docId) {
  showLoadingOverlay()

  setTimeout(() => {
    hideLoadingOverlay()
    alert("Document analysis complete! Key topics and concepts have been identified and added to your study materials.")
  }, 2000)
}

function removeDocument(docId) {
  if (confirm("Are you sure you want to remove this document?")) {
    uploadedDocuments = uploadedDocuments.filter((doc) => doc.id !== docId)
    // Remove from DOM
    document.querySelector(`[onclick="removeDocument('${docId}')"]`).closest(".document-item").remove()
  }
}

function analyzeAllDocuments() {
  if (uploadedDocuments.length === 0) {
    alert("No documents to analyze. Please upload some documents first.")
    return
  }

  showLoadingOverlay()

  setTimeout(() => {
    hideLoadingOverlay()
    alert(
      `Analysis complete! Processed ${uploadedDocuments.length} documents and extracted key concepts for your study session.`,
    )
  }, 3000)
}

function generateDocumentSummary() {
  if (uploadedDocuments.length === 0) {
    alert("No documents to summarize. Please upload some documents first.")
    return
  }

  showLoadingOverlay()

  setTimeout(() => {
    hideLoadingOverlay()
    alert("Document summary generated! A comprehensive summary of all your uploaded materials has been created.")
  }, 2500)
}

// Utility functions
function showLoading(elementId) {
  document.getElementById(elementId).classList.remove("hidden")
}

function hideLoading(elementId) {
  document.getElementById(elementId).classList.add("hidden")
}

function showLoadingOverlay() {
  document.getElementById("loadingOverlay").classList.remove("hidden")
}

function hideLoadingOverlay() {
  document.getElementById("loadingOverlay").classList.add("hidden")
}

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  setupDocumentUpload()

  // Initialize with some sample flashcards
  flashcards = [
    {
      question: "What is the capital of France?",
      answer: "Paris is the capital and largest city of France.",
    },
    {
      question: "What is photosynthesis?",
      answer:
        "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar.",
    },
  ]

  updateProgress()
})
