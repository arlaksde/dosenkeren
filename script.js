document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // THEME SWITCHER (Tetap Ada)
    // ======================
    const themeToggle = document.querySelector('.theme-toggle');
    const themeOptions = document.querySelector('.theme-options');
    
    if (themeToggle && themeOptions) {
      themeToggle.addEventListener('click', function() {
        themeOptions.classList.toggle('show');
      });
  
      document.querySelectorAll('.theme-option').forEach(button => {
        button.addEventListener('click', function() {
          const theme = this.getAttribute('data-theme');
          document.body.className = theme;
          themeOptions.classList.remove('show');
        });
      });
    }
  
    // ======================
    // MEETING SYSTEM (Perbaikan)
    // ======================
    const meetingStatus = {
      currentDosen: null,
      currentVisitor: null,
      isDosen: false,
      isBusy: false,
      pendingRequests: [],
      currentMeeting: null
    };
  
    // Modal Elements
    const modal = document.getElementById('meetingModal');
    const closeBtn = document.querySelector('.close');
    const btnDosen = document.querySelector('.btn-dosen');
    const btnMahasiswa = document.querySelector('.btn-mahasiswa');
    const dosenForm = document.getElementById('dosenForm');
    const mahasiswaForm = document.getElementById('mahasiswaForm');
    const statusLed = document.getElementById('statusLed');
    const statusText = document.getElementById('statusText');
  
    // Toggle Form Dosen/Mahasiswa
    if (btnDosen && btnMahasiswa) {
      btnDosen.addEventListener('click', () => {
        dosenForm.classList.remove('hidden');
        mahasiswaForm.classList.add('hidden');
      });
  
      btnMahasiswa.addEventListener('click', () => {
        mahasiswaForm.classList.remove('hidden');
        dosenForm.classList.add('hidden');
      });
    }
  
    // Form Dosen
    const confirmDosen = document.getElementById('confirmDosen');
    if (confirmDosen) {
      confirmDosen.addEventListener('click', () => {
        const namaDosen = document.getElementById('namaDosenInput')?.value.trim();
        if (namaDosen) {
          meetingStatus.currentVisitor = namaDosen;
          meetingStatus.isDosen = true;
          
          const request = {
            pengunjung: namaDosen,
            sebagai: "Dosen",
            tujuan: meetingStatus.currentDosen,
            waktu: new Date(),
            status: "Menunggu"
          };
          
          meetingStatus.pendingRequests.push(request);
          updateStatus();
          alert(`Halo Bapak/Ibu ${namaDosen}, permintaan pertemuan dengan Bapak ${meetingStatus.currentDosen} telah dikirim. Mohon ditunggu.`);
          modal.style.display = 'none';
          sendToMonitor(request);
        } else {
          alert("Silakan masukkan nama dosen!");
        }
      });
    }
  
    // Form Mahasiswa
    const requestMeeting = document.getElementById('requestMeeting');
    if (requestMeeting) {
      requestMeeting.addEventListener('click', () => {
        const nama = document.getElementById('namaMahasiswa')?.value.trim();
        const nim = document.getElementById('nimMahasiswa')?.value.trim();
        
        if (nama && nim) {
          const request = {
            pengunjung: nama,
            nim: nim,
            sebagai: "Mahasiswa",
            tujuan: meetingStatus.currentDosen,
            waktu: new Date(),
            status: "Menunggu"
          };
          
          meetingStatus.pendingRequests.push(request);
          updateStatus();
          alert(`[MAHASISWA] Permintaan pertemuan dikirim. Mohon ditunggu.`);
          modal.style.display = 'none';
          sendToMonitor(request);
        } else {
          alert("Silakan lengkapi nama dan NIM!");
        }
      });
    }
  
    // Buka Modal Pertemuan
    document.querySelectorAll('.btn-bertemu').forEach(btn => {
      btn.addEventListener('click', function() {
        meetingStatus.currentDosen = this.closest('.dosen-card').querySelector('.dosen-name').textContent;
        modal.style.display = 'block';
        
        // Reset form selection
        dosenForm.classList.add('hidden');
        mahasiswaForm.classList.add('hidden');
      });
    });
  
    // Fungsi Pendukung
    function updateStatus() {
      if (meetingStatus.currentMeeting?.status === "Sedang Berlangsung") {
        statusLed.className = 'led busy';
        statusText.textContent = 'Status: Sibuk (Dalam Pertemuan)';
      } else if (meetingStatus.pendingRequests.length > 0) {
        statusLed.className = 'led pending';
        const numDosen = meetingStatus.pendingRequests.filter(r => r.sebagai === "Dosen").length;
        const numMahasiswa = meetingStatus.pendingRequests.filter(r => r.sebagai === "Mahasiswa").length;
        statusText.textContent = `Status: Menunggu (${numDosen} Dosen, ${numMahasiswa} Mhs)`;
      } else {
        statusLed.className = 'led available';
        statusText.textContent = 'Status: Tersedia';
      }
    }
  
    function sendToMonitor(data) {
      console.log("Data ke Monitor:", data);
      // Simulasi persetujuan setelah 2 detik
      setTimeout(() => {
        if (confirm(`${data.tujuan}: Terima pertemuan dengan ${data.pengunjung}?`)) {
          meetingStatus.currentMeeting = data;
          meetingStatus.currentMeeting.status = "Sedang Berlangsung";
          meetingStatus.pendingRequests = meetingStatus.pendingRequests.filter(r => 
            !(r.pengunjung === data.pengunjung && r.waktu === data.waktu)
          );
          updateStatus();
        }
      }, 2000);
    }
  
    // Close Modal
    if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });