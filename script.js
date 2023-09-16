$(document).ready(function() {
    class Pendaftar {
        constructor(nama, umur, uangsaku) {
            this.nama = nama;
            this.umur = umur;
            this.uangsaku = uangsaku;
        }

        isValid() {
            return this.nama.length >= 10 && this.umur >= 25 && this.uangsaku >= 100000 && this.uangsaku <= 1000000;
        }
    }

    class PendaftarManager {
        constructor() {
            this.pendaftarList = [];
        }

        addPendaftar(pendaftar) {
            this.pendaftarList.push(pendaftar);
        }

        getAverage() {
            let totalUmur = 0;
            let totalUangSaku = 0;

            for (const data of this.pendaftarList) {
                totalUmur += data.umur;
                totalUangSaku += data.uangsaku;
            }

            const rataRataUmur = totalUmur / this.pendaftarList.length;
            const rataRataUangSaku = totalUangSaku / this.pendaftarList.length;

            return { rataRataUmur, rataRataUangSaku };
        }

        async saveToServer() {
            const { rataRataUmur, rataRataUangSaku } = this.getAverage();
            const resumeText = `Rata-rata Total Uang Saku pendaftar adalah : Rp. ${rataRataUangSaku.toFixed(2)} Dengan Rata-Rata Umur : ${rataRataUmur.toFixed(2)}`;
            try {
                const response = await $.ajax({
                    url: "/simpan_pendaftar.php", 
                    type: "POST",
                    data: { resume: resumeText }
                });

                alert(response);
            } catch (error) {
                console.error("Gagal mengirim data ke server:", error);
            }
        }
    }

    const pendaftarManager = new PendaftarManager();

    $("#registrationForm").submit(async function(event) {
        console.log("Form submitted");
        event.preventDefault();
        const nama = $("input[name='nama']").val();
        const umur = parseInt($("input[name='umur']").val());
        const uangsaku = parseInt($("input[name='uangsaku']").val());
        if (nama.length < 10) {
            alert("Nama Minimal memiliki 10 karakter!");
            return;
        }
        if (umur < 25) {
            alert("Umur Minimal 25 Tahun!");
            return;
        }
        if (uangsaku < 100000 || uangsaku > 1000000){
            alert("Uang Saku Minimal Rp.100000 dan Maksimal Rp.1000000!");
        }
        const pendaftar = new Pendaftar(nama, umur, uangsaku);
        pendaftarManager.addPendaftar(pendaftar);
        try {
            await pendaftarManager.saveToServer();
        } catch (error) {
            alert("Gagal menyimpan data ke server.");
        }

        $("input[name='nama']").val("");
        $("input[name='umur']").val("");
        $("input[name='uangsaku']").val("");

        tampilkanDataPendaftar();
    });

    function tampilkanDataPendaftar() {
        const tbody = $("#pendaftarTable");
        tbody.empty();

        pendaftarManager.pendaftarList.forEach(function(data) {
            const row = $("<tr>");
            row.append($("<td>").text(data.nama));
            row.append($("<td>").text(data.umur));
            row.append($("<td>").text(data.uangsaku));
            tbody.append(row);
        });

        const { rataRataUmur, rataRataUangSaku } = pendaftarManager.getAverage();
        const resumeText = `Rata-rata Total Uang Saku pendaftar adalah : Rp. ${rataRataUangSaku.toFixed(2)} \n Dengan Rata-Rata Umur : ${rataRataUmur.toFixed(2)}`;

        $("#resume").text(resumeText);
    }

    $("#registrasiTabBtn").click(function() {
        $(".tabcontent").hide();
        $(".tablinks.active").removeClass("active");
        $("#registrasiTabContent").show();
        $(this).addClass("active");
    });

    $("#listPendaftarTabBtn").click(function() {
        $(".tabcontent").hide();
        $(".tablinks.active").removeClass("active");
        $("#listPendaftarTabContent").show();
        $(this).addClass("active");
        tampilkanDataPendaftar();
    });

    $("#registrasiTabBtn").click();
});
