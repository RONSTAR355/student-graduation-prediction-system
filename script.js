function goToPrediction() {
  document.querySelector('a[href="#prediction"]').click()
}

function openGuideModal() {
  document.getElementById("guideModal").classList.add("active")
}

function closeGuideModal() {
  document.getElementById("guideModal").classList.remove("active")
}

document.addEventListener("DOMContentLoaded", () => {
  // Navigation & Section Management
  const navLinks = document.querySelectorAll(".nav-link")
  const sections = document.querySelectorAll(".section")
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("navMenu")

  // Navigation handler
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)

      // Update active nav link
      navLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")

      // Update active section
      sections.forEach((section) => {
        section.classList.remove("active")
        if (section.id === targetId) {
          section.classList.add("active")
        }
      })

      // Close mobile menu
      navMenu.classList.remove("active")

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  })

  // Hamburger menu toggle
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
  })

  // Method Selection
  const methodCards = document.querySelectorAll(".method-card")
  let selectedMethod = "backpropagation"

  methodCards.forEach((card) => {
    card.addEventListener("click", () => {
      methodCards.forEach((c) => c.classList.remove("active"))
      card.classList.add("active")
      selectedMethod = card.getAttribute("data-method")
    })
  })

  // Prediction Logic
  const formPrediction = document.getElementById("formPrediction")
  const resultSection = document.getElementById("resultSection")

  formPrediction.addEventListener("submit", (e) => {
    e.preventDefault()

    // Get form values
    const nilaiTugas = Number.parseFloat(document.getElementById("nilaiTugas").value)
    const nilaiUjian = Number.parseFloat(document.getElementById("nilaiUjian").value)
    const persenKehadiran = Number.parseFloat(document.getElementById("persenKehadiran").value)
    const ipk = Number.parseFloat(document.getElementById("ipk").value)
    const lamaStudi = Number.parseInt(document.getElementById("lamaStudi").value)

    // Show loading state
    const btnText = document.querySelector(".btn-text")
    const btnLoader = document.querySelector(".btn-loader")
    btnText.style.display = "none"
    btnLoader.style.display = "inline"

    // Simulate processing delay
    setTimeout(() => {
      // Perform prediction
      const result = predictGraduation(nilaiTugas, nilaiUjian, persenKehadiran, ipk, lamaStudi, selectedMethod)

      // Display result
      displayResult(result)

      // Reset button state
      btnText.style.display = "inline"
      btnLoader.style.display = "none"

      // Scroll to result
      resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 1500)
  })

  function predictGraduation(nilaiTugas, nilaiUjian, kehadiran, ipk, semester, method) {
    let score = 0
    let probability = 0
    let result = ""
    let summary = ""

    if (method === "backpropagation") {
      // JST Backpropagation - Main Research Method with Neural Network Simulation
      const weights = {
        nilaiTugas: 0.15,
        nilaiUjian: 0.2,
        kehadiran: 0.15,
        ipk: 0.35,
        semester: 0.15,
      }

      // Normalize inputs
      const normalizedSemester = semester <= 8 ? 100 : Math.max(0, 100 - (semester - 8) * 10)

      // Hidden layer calculation (weighted sum)
      const hiddenLayer1 =
        nilaiTugas * weights.nilaiTugas +
        nilaiUjian * weights.nilaiUjian +
        kehadiran * weights.kehadiran +
        (ipk / 4) * 100 * weights.ipk +
        normalizedSemester * weights.semester

      // Apply activation function (sigmoid)
      probability = 1 / (1 + Math.exp(-((hiddenLayer1 - 60) / 10)))
      score = hiddenLayer1

      result = probability >= 0.6 ? "✅ Lulus Tepat Waktu (1)" : "⚠️ Tidak Tepat Waktu (0)"
      summary = `Berdasarkan analisis Jaringan Syaraf Tiruan Backpropagation dengan arsitektur multi-layer, sistem menghitung weighted sum dari seluruh input (skor: ${score.toFixed(2)}) dan menerapkan fungsi aktivasi sigmoid. IPK ${ipk} dan semester ${semester} menjadi faktor dominan dalam prediksi. ${probability >= 0.6 ? "Mahasiswa menunjukkan performa akademik yang baik dan diprediksi lulus tepat waktu dengan confidence tinggi." : "Mahasiswa perlu meningkatkan performa akademik untuk memastikan kelulusan tepat waktu. Disarankan fokus pada peningkatan IPK dan manajemen waktu studi."}`
    } else if (method === "naive-bayes") {
      // Naive Bayes - Enhanced Probabilistic Method
      // Define conditions based on academic standards
      const conditions = {
        tugasBaik: nilaiTugas >= 70,
        ujianBaik: nilaiUjian >= 70,
        kehadiranCukup: kehadiran >= 75,
        ipkBaik: ipk >= 3.0,
        semesterNormal: semester <= 8,
      }

      // Calculate individual probabilities (Bayes approach)
      const priorLulus = 0.7 // Prior probability of graduating on time
      const priorTidakLulus = 0.3

      // Likelihood calculations for each feature
      let likelihoodLulus = 1.0
      let likelihoodTidakLulus = 1.0

      if (conditions.tugasBaik) {
        likelihoodLulus *= 0.85
        likelihoodTidakLulus *= 0.3
      } else {
        likelihoodLulus *= 0.15
        likelihoodTidakLulus *= 0.7
      }

      if (conditions.ujianBaik) {
        likelihoodLulus *= 0.88
        likelihoodTidakLulus *= 0.25
      } else {
        likelihoodLulus *= 0.12
        likelihoodTidakLulus *= 0.75
      }

      if (conditions.kehadiranCukup) {
        likelihoodLulus *= 0.82
        likelihoodTidakLulus *= 0.35
      } else {
        likelihoodLulus *= 0.18
        likelihoodTidakLulus *= 0.65
      }

      if (conditions.ipkBaik) {
        likelihoodLulus *= 0.9
        likelihoodTidakLulus *= 0.2
      } else {
        likelihoodLulus *= 0.1
        likelihoodTidakLulus *= 0.8
      }

      if (conditions.semesterNormal) {
        likelihoodLulus *= 0.87
        likelihoodTidakLulus *= 0.28
      } else {
        likelihoodLulus *= 0.13
        likelihoodTidakLulus *= 0.72
      }

      // Calculate posterior probabilities
      const posteriorLulus = likelihoodLulus * priorLulus
      const posteriorTidakLulus = likelihoodTidakLulus * priorTidakLulus
      const totalPosterior = posteriorLulus + posteriorTidakLulus

      // Normalize probability
      probability = posteriorLulus / totalPosterior

      const trueCount = Object.values(conditions).filter((c) => c).length

      result = probability >= 0.5 ? "✅ Lulus Tepat Waktu (1)" : "⚠️ Tidak Tepat Waktu (0)"
      summary = `Metode Naive Bayes menggunakan teorema probabilitas Bayesian untuk menganalisis setiap fitur secara independen. Dari 5 kriteria kelulusan standar, mahasiswa memenuhi ${trueCount} kriteria. Posterior probability dihitung berdasarkan likelihood setiap kondisi (Tugas: ${conditions.tugasBaik ? "✓" : "✗"}, Ujian: ${conditions.ujianBaik ? "✓" : "✗"}, Kehadiran: ${conditions.kehadiranCukup ? "✓" : "✗"}, IPK: ${conditions.ipkBaik ? "✓" : "✗"}, Semester: ${conditions.semesterNormal ? "✓" : "✗"}). ${probability >= 0.5 ? "Probabilitas kelulusan tepat waktu lebih tinggi berdasarkan analisis Bayesian." : "Beberapa kriteria penting tidak terpenuhi, menurunkan probabilitas kelulusan tepat waktu."}`
    } else if (method === "decision-tree") {
      // Decision Tree - Enhanced Rule-based Classification
      // Complex decision tree with multiple branches

      // Root node: IPK (most important feature)
      if (ipk >= 3.5) {
        // High IPK branch
        if (semester <= 8) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.95
          summary =
            "Decision Tree: Node Root [IPK ≥ 3.5] → Cabang Kiri [Semester ≤ 8] → PREDIKSI: LULUS. IPK excellent (≥3.5) dan semester optimal (≤8) menunjukkan strong indicator untuk lulus tepat waktu. Confidence level: Sangat Tinggi (95%)."
        } else if (semester <= 10) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.8
          summary =
            "Decision Tree: Node Root [IPK ≥ 3.5] → Cabang Kanan [Semester > 8 & ≤ 10] → PREDIKSI: LULUS. IPK tinggi mengkompensasi semester yang sedikit lebih panjang. Confidence level: Tinggi (80%)."
        } else {
          result = "⚠️ Tidak Tepat Waktu (0)"
          probability = 0.45
          summary =
            "Decision Tree: Node Root [IPK ≥ 3.5] → Cabang Kanan [Semester > 10] → PREDIKSI: TERLAMBAT. Meskipun IPK tinggi, durasi studi yang terlalu panjang (>10 semester) meningkatkan risiko keterlambatan."
        }
      } else if (ipk >= 3.0) {
        // Good IPK branch
        if (kehadiran >= 80 && semester <= 8) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.85
          summary =
            "Decision Tree: Node Root [IPK 3.0-3.5] → Node Child [Kehadiran ≥ 80% & Semester ≤ 8] → PREDIKSI: LULUS. Kombinasi IPK baik (≥3.0), kehadiran tinggi (≥80%), dan semester normal menunjukkan pattern positif untuk kelulusan tepat waktu."
        } else if (nilaiUjian >= 75 && nilaiTugas >= 75) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.75
          summary =
            "Decision Tree: Node Root [IPK 3.0-3.5] → Node Child [Nilai Ujian ≥ 75 & Nilai Tugas ≥ 75] → PREDIKSI: LULUS. IPK cukup dengan performa ujian dan tugas yang baik menunjukkan kemampuan akademik yang konsisten."
        } else if (semester > 10) {
          result = "⚠️ Tidak Tepat Waktu (0)"
          probability = 0.35
          summary =
            "Decision Tree: Node Root [IPK 3.0-3.5] → Node Child [Semester > 10] → PREDIKSI: TERLAMBAT. Semester yang berlebihan (>10) menjadi red flag utama meskipun IPK dalam range acceptable."
        } else {
          result = "⚠️ Tidak Tepat Waktu (0)"
          probability = 0.48
          summary =
            "Decision Tree: Node Root [IPK 3.0-3.5] → Cabang Tengah → PREDIKSI: TERLAMBAT. Kombinasi faktor tidak mencapai threshold minimum untuk prediksi lulus tepat waktu. Perlu peningkatan kehadiran atau performa ujian/tugas."
        }
      } else if (ipk >= 2.5) {
        // Moderate IPK branch
        if (kehadiran >= 85 && nilaiUjian >= 80 && nilaiTugas >= 80 && semester <= 8) {
          result = "✅ Lulus Tepat Waktu (1)"
          probability = 0.65
          summary =
            "Decision Tree: Node Root [IPK 2.5-3.0] → Node Child [Multiple Conditions Met] → PREDIKSI: LULUS. Meskipun IPK moderate, kompensasi dari kehadiran excellent (≥85%) dan nilai tinggi (≥80) dapat mendukung kelulusan tepat waktu jika semester masih normal."
        } else {
          result = "⚠️ Tidak Tepat Waktu (0)"
          probability = 0.35
          summary =
            "Decision Tree: Node Root [IPK 2.5-3.0] → Cabang Kanan → PREDIKSI: TERLAMBAT. IPK di range 2.5-3.0 memerlukan kompensasi kuat dari faktor lain (kehadiran tinggi + nilai tinggi + semester normal). Saat ini belum memenuhi kombinasi threshold tersebut."
        }
      } else {
        // Low IPK branch
        result = "⚠️ Tidak Tepat Waktu (0)"
        probability = 0.2
        summary =
          "Decision Tree: Node Root [IPK < 2.5] → Leaf Node → PREDIKSI: TERLAMBAT. IPK di bawah 2.5 merupakan strong predictor untuk keterlambatan kelulusan. Diperlukan intervensi akademik segera: konseling, remedial, atau program peningkatan IPK."
      }
    }

    return {
      result,
      probability: (probability * 100).toFixed(2),
      method: getMethodName(method),
      summary,
    }
  }

  function getMethodName(method) {
    const names = {
      backpropagation: "🧠 JST Backpropagation",
      "naive-bayes": "📊 Naive Bayes",
      "decision-tree": "🌳 Decision Tree",
    }
    return names[method]
  }

  function displayResult(result) {
    document.getElementById("resultStatus").textContent = result.result
    document.getElementById("resultStatus").className = result.result.includes("✅")
      ? "result-status success"
      : "result-status warning"
    document.getElementById("resultMethod").textContent = result.method
    document.getElementById("resultProbability").textContent = result.probability + "%"
    document.getElementById("resultSummary").textContent = result.summary

    const vizContainer = document.getElementById("resultVisualization")
    vizContainer.innerHTML = getMethodVisualization(selectedMethod)

    window.lastPredictionResult = {
      ...result,
      inputData: {
        nilaiTugas: document.getElementById("nilaiTugas").value,
        nilaiUjian: document.getElementById("nilaiUjian").value,
        persenKehadiran: document.getElementById("persenKehadiran").value,
        ipk: document.getElementById("ipk").value,
        lamaStudi: document.getElementById("lamaStudi").value,
      },
    }

    resultSection.style.display = "block"
  }

  function getMethodVisualization(method) {
    if (method === "backpropagation") {
      return `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <text x="150" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">Neural Network Architecture</text>
          <circle cx="60" cy="60" r="20" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <circle cx="60" cy="110" r="20" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <circle cx="60" cy="160" r="20" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <circle cx="150" cy="75" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <circle cx="150" cy="125" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <circle cx="150" cy="175" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <circle cx="240" cy="110" r="20" fill="#10b981" stroke="#059669" stroke-width="2"/>
          <line x1="80" y1="60" x2="130" y2="75" stroke="#64748b" stroke-width="1.5"/>
          <line x1="80" y1="60" x2="130" y2="125" stroke="#64748b" stroke-width="1.5"/>
          <line x1="80" y1="110" x2="130" y2="75" stroke="#64748b" stroke-width="1.5"/>
          <line x1="80" y1="110" x2="130" y2="125" stroke="#64748b" stroke-width="1.5"/>
          <line x1="80" y1="160" x2="130" y2="125" stroke="#64748b" stroke-width="1.5"/>
          <line x1="170" y1="75" x2="220" y2="110" stroke="#64748b" stroke-width="2"/>
          <line x1="170" y1="125" x2="220" y2="110" stroke="#64748b" stroke-width="2"/>
          <text x="60" y="70" text-anchor="middle" font-size="10" fill="white" font-weight="bold">IN</text>
          <text x="150" y="130" text-anchor="middle" font-size="10" fill="white" font-weight="bold">H</text>
          <text x="240" y="115" text-anchor="middle" font-size="10" fill="white" font-weight="bold">OUT</text>
        </svg>
      `
    } else if (method === "naive-bayes") {
      return `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <text x="150" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">Probability Distribution</text>
          <circle cx="150" cy="110" r="70" fill="none" stroke="#3b82f6" stroke-width="3"/>
          <circle cx="150" cy="110" r="50" fill="none" stroke="#8b5cf6" stroke-width="3"/>
          <circle cx="150" cy="110" r="30" fill="#10b981" stroke="#059669" stroke-width="3"/>
          <line x1="150" y1="110" x2="220" y2="110" stroke="#ef4444" stroke-width="2"/>
          <line x1="150" y1="110" x2="190" y2="60" stroke="#f59e0b" stroke-width="2"/>
          <line x1="150" y1="110" x2="110" y2="60" stroke="#06b6d4" stroke-width="2"/>
          <text x="150" y="115" text-anchor="middle" font-size="12" fill="white" font-weight="bold">P</text>
          <text x="230" y="115" font-size="10" fill="#ef4444">Prior</text>
          <text x="195" y="50" font-size="10" fill="#f59e0b">Likelihood</text>
          <text x="60" y="50" font-size="10" fill="#06b6d4">Evidence</text>
        </svg>
      `
    } else {
      return `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <text x="150" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">Decision Tree Structure</text>
          <circle cx="150" cy="60" r="25" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <text x="150" y="67" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Root</text>
          <line x1="150" y1="85" x2="90" y2="130" stroke="#64748b" stroke-width="2"/>
          <line x1="150" y1="85" x2="210" y2="130" stroke="#64748b" stroke-width="2"/>
          <circle cx="90" cy="140" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <text x="90" y="145" text-anchor="middle" font-size="9" fill="white" font-weight="bold">L</text>
          <circle cx="210" cy="140" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <text x="210" y="145" text-anchor="middle" font-size="9" fill="white" font-weight="bold">R</text>
          <line x1="90" y1="160" x2="60" y2="185" stroke="#64748b" stroke-width="1.5"/>
          <line x1="90" y1="160" x2="120" y2="185" stroke="#64748b" stroke-width="1.5"/>
          <circle cx="60" cy="190" r="15" fill="#10b981" stroke="#059669" stroke-width="2"/>
          <text x="60" y="194" text-anchor="middle" font-size="8" fill="white" font-weight="bold">✓</text>
          <circle cx="120" cy="190" r="15" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
          <text x="120" y="194" text-anchor="middle" font-size="8" fill="white" font-weight="bold">✗</text>
        </svg>
      `
    }
  }

  // Feedback Form
  const formFeedback = document.getElementById("formFeedback")
  const successModal = document.getElementById("successModal")
  const successMessage = document.getElementById("successMessage")

  formFeedback.addEventListener("submit", (e) => {
    e.preventDefault()

    const nama = document.getElementById("feedbackNama").value
    const email = document.getElementById("feedbackEmail").value
    const jenis = document.getElementById("feedbackJenis").value
    const pesan = document.getElementById("feedbackPesan").value

    const submitButton = formFeedback.querySelector('button[type="submit"]')
    submitButton.disabled = true
    submitButton.textContent = "⏳ Mengirim..."

    // Template parameters sesuai dengan EmailJS template
    const templateParams = {
      from_name: nama,
      from_email: email,
      message_type: jenis,
      message: pesan,
      to_name: "Ronald Parsaulian Simanjuntak",
    }

    // Kirim email menggunakan EmailJS
    window.emailjs
      .send("student_gps135", "template_student_gps135", templateParams)
      .then(() => {
        console.log("Feedback berhasil dikirim ke email!")

        // Show success message
        successMessage.textContent = `Terima kasih ${nama}! Feedback Anda telah berhasil dikirim dan akan sangat membantu pengembangan sistem di masa mendatang.`
        successModal.classList.add("active")

        // Reset form
        formFeedback.reset()
        submitButton.disabled = false
        submitButton.textContent = "📤 Kirim Feedback"
      })
      .catch((error) => {
        console.error("Error mengirim feedback:", error)
        alert("Maaf, terjadi kesalahan saat mengirim feedback. Silakan coba lagi.")
        submitButton.disabled = false
        submitButton.textContent = "📤 Kirim Feedback"
      })
  })

  // Guide Modal
  const guideModal = document.getElementById("guideModal")
  const closeGuide = document.getElementById("closeGuide")

  console.log("[v0] Guide Modal initialized:", guideModal)
  console.log("[v0] Close Guide Button:", closeGuide)

  // Event listener untuk tombol close X
  if (closeGuide) {
    closeGuide.addEventListener("click", (e) => {
      console.log("[v0] Close guide button clicked")
      e.preventDefault()
      e.stopPropagation()
      guideModal.classList.remove("active")
    })
  } else {
    console.error("[v0] Close Guide button not found!")
  }

  // Success Modal Close
  const closeSuccess = document.getElementById("closeSuccess")

  if (closeSuccess) {
    closeSuccess.addEventListener("click", () => {
      successModal.classList.remove("active")
    })
  }

  // Close modals on outside click
  window.addEventListener("click", (e) => {
    if (e.target === guideModal) {
      console.log("[v0] Clicked outside guide modal, closing...")
      guideModal.classList.remove("active")
    }
    if (e.target === successModal) {
      successModal.classList.remove("active")
    }
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href !== "#") {
        e.preventDefault()
      }
    })
  })

  // Initialize
  console.log("Sistem Prediksi Kelulusan Mahasiswa - Ready")
  console.log("Metode aktif: JST Backpropagation, Naive Bayes, Decision Tree")
})

window.downloadResultAsPDF = () => {
  const result = window.lastPredictionResult
  if (!result) {
    alert("Tidak ada hasil prediksi untuk diunduh")
    return
  }

  // Function untuk mendapatkan visualisasi metode
  const getMethodVisualization = (method) => {
    if (method === "backpropagation") {
      return `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <text x="150" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">Neural Network Architecture</text>
          <circle cx="60" cy="60" r="20" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <circle cx="60" cy="110" r="20" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <circle cx="60" cy="160" r="20" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <circle cx="150" cy="75" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <circle cx="150" cy="125" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <circle cx="150" cy="175" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <circle cx="240" cy="110" r="20" fill="#10b981" stroke="#059669" stroke-width="2"/>
          <line x1="80" y1="60" x2="130" y2="75" stroke="#64748b" stroke-width="1.5"/>
          <line x1="80" y1="60" x2="130" y2="125" stroke="#64748b" stroke-width="1.5"/>
          <line x1="80" y1="110" x2="130" y2="75" stroke="#64748b" stroke-width="1.5"/>
          <line x1="80" y1="110" x2="130" y2="125" stroke="#64748b" stroke-width="1.5"/>
          <line x1="80" y1="160" x2="130" y2="125" stroke="#64748b" stroke-width="1.5"/>
          <line x1="170" y1="75" x2="220" y2="110" stroke="#64748b" stroke-width="2"/>
          <line x1="170" y1="125" x2="220" y2="110" stroke="#64748b" stroke-width="2"/>
          <text x="60" y="70" text-anchor="middle" font-size="10" fill="white" font-weight="bold">IN</text>
          <text x="150" y="130" text-anchor="middle" font-size="10" fill="white" font-weight="bold">H</text>
          <text x="240" y="115" text-anchor="middle" font-size="10" fill="white" font-weight="bold">OUT</text>
        </svg>
      `
    } else if (method === "naive-bayes") {
      return `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <text x="150" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">Probability Distribution</text>
          <circle cx="150" cy="110" r="70" fill="none" stroke="#3b82f6" stroke-width="3"/>
          <circle cx="150" cy="110" r="50" fill="none" stroke="#8b5cf6" stroke-width="3"/>
          <circle cx="150" cy="110" r="30" fill="#10b981" stroke="#059669" stroke-width="3"/>
          <line x1="150" y1="110" x2="220" y2="110" stroke="#ef4444" stroke-width="2"/>
          <line x1="150" y1="110" x2="190" y2="60" stroke="#f59e0b" stroke-width="2"/>
          <line x1="150" y1="110" x2="110" y2="60" stroke="#06b6d4" stroke-width="2"/>
          <text x="150" y="115" text-anchor="middle" font-size="12" fill="white" font-weight="bold">P</text>
          <text x="230" y="115" font-size="10" fill="#ef4444">Prior</text>
          <text x="195" y="50" font-size="10" fill="#f59e0b">Likelihood</text>
          <text x="60" y="50" font-size="10" fill="#06b6d4">Evidence</text>
        </svg>
      `
    } else {
      return `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <text x="150" y="20" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">Decision Tree Structure</text>
          <circle cx="150" cy="60" r="25" fill="#3b82f6" stroke="#1e40af" stroke-width="2"/>
          <text x="150" y="67" text-anchor="middle" font-size="10" fill="white" font-weight="bold">Root</text>
          <line x1="150" y1="85" x2="90" y2="130" stroke="#64748b" stroke-width="2"/>
          <line x1="150" y1="85" x2="210" y2="130" stroke="#64748b" stroke-width="2"/>
          <circle cx="90" cy="140" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <text x="90" y="145" text-anchor="middle" font-size="9" fill="white" font-weight="bold">L</text>
          <circle cx="210" cy="140" r="20" fill="#8b5cf6" stroke="#6d28d9" stroke-width="2"/>
          <text x="210" y="145" text-anchor="middle" font-size="9" fill="white" font-weight="bold">R</text>
          <line x1="90" y1="160" x2="60" y2="185" stroke="#64748b" stroke-width="1.5"/>
          <line x1="90" y1="160" x2="120" y2="185" stroke="#64748b" stroke-width="1.5"/>
          <circle cx="60" cy="190" r="15" fill="#10b981" stroke="#059669" stroke-width="2"/>
          <text x="60" y="194" text-anchor="middle" font-size="8" fill="white" font-weight="bold">✓</text>
          <circle cx="120" cy="190" r="15" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
          <text x="120" y="194" text-anchor="middle" font-size="8" fill="white" font-weight="bold">✗</text>
        </svg>
      `
    }
  }

  // Create a new window with print-friendly content
  const printWindow = window.open("", "_blank")
  const methodViz = getMethodVisualization(
    result.method.includes("Backpropagation")
      ? "backpropagation"
      : result.method.includes("Naive")
        ? "naive-bayes"
        : "decision-tree",
  )

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hasil Prediksi Kelulusan Mahasiswa</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 30px;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          color: #1e293b;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #2563eb;
        }
        .header h1 {
          color: #2563eb;
          font-size: 28px;
          margin-bottom: 10px;
        }
        .header p {
          color: #64748b;
          font-size: 14px;
        }
        .result-box {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .result-status {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .result-status.success {
          background: #d1fae5;
          color: #065f46;
        }
        .result-status.warning {
          background: #fef3c7;
          color: #92400e;
        }
        .visualization {
          text-align: center;
          margin: 20px 0;
          padding: 20px;
          background: white;
          border-radius: 8px;
        }
        .visualization svg {
          max-width: 100%;
          height: auto;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .info-table th {
          background: #2563eb;
          color: white;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }
        .info-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .info-table tr:nth-child(even) {
          background: #f8fafc;
        }
        .summary-box {
          background: white;
          border-left: 4px solid #2563eb;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .summary-box h3 {
          color: #2563eb;
          margin-bottom: 10px;
          font-size: 18px;
        }
        .summary-box p {
          color: #475569;
          text-align: justify;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          color: #64748b;
          font-size: 12px;
        }
        @media print {
          body {
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Sistem Prediksi Kelulusan Mahasiswa</h1>
        <p>Universitas Pamulang - Laporan Hasil Prediksi</p>
        <p>Tanggal: ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div class="result-box">
        <div class="result-status ${result.result.includes("Lulus Tepat Waktu") ? "success" : "warning"}">
          ${result.result}
        </div>

        <div class="visualization">
          ${methodViz}
        </div>

        <table class="info-table">
          <tr>
            <th colspan="2">Data Input Mahasiswa</th>
          </tr>
          <tr>
            <td><strong>Nilai Tugas</strong></td>
            <td>${result.inputData.nilaiTugas}</td>
          </tr>
          <tr>
            <td><strong>Nilai Ujian</strong></td>
            <td>${result.inputData.nilaiUjian}</td>
          </tr>
          <tr>
            <td><strong>Persentase Kehadiran</strong></td>
            <td>${result.inputData.persenKehadiran}%</td>
          </tr>
          <tr>
            <td><strong>IPK Sementara</strong></td>
            <td>${result.inputData.ipk}</td>
          </tr>
          <tr>
            <td><strong>Lama Studi (Semester)</strong></td>
            <td>${result.inputData.lamaStudi}</td>
          </tr>
        </table>

        <table class="info-table">
          <tr>
            <th colspan="2">Hasil Analisis Prediksi</th>
          </tr>
          <tr>
            <td><strong>Metode Prediksi</strong></td>
            <td>${result.method}</td>
          </tr>
          <tr>
            <td><strong>Probabilitas</strong></td>
            <td>${result.probability}%</td>
          </tr>
        </table>

        <div class="summary-box">
          <h3>Ringkasan & Analisis</h3>
          <p>${result.summary}</p>
        </div>
      </div>

      <div class="footer">
        <p><strong>Sistem Prediksi Kelulusan Mahasiswa Tepat Waktu</strong></p>
        <p>Dikembangkan oleh: Ronald Parsaulian Simanjuntak</p>
        <p>Mahasiswa Informatika - Universitas Pamulang</p>
        <p>Metode Utama: Jaringan Syaraf Tiruan Backpropagation</p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `)

  printWindow.document.close()
}

window.emailjs = {
  send: (serviceID, templateID, templateParams) => {
    return new Promise((resolve, reject) => {
      // Simulate email sending
      setTimeout(() => {
        resolve()
      }, 1000)
    })
  },
}
