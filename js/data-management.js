// ไฟล์สำหรับจัดการข้อมูล Export, Import และ Reset
document.addEventListener("DOMContentLoaded", function() {
    // เพิ่มฟังก์ชันการทำงานให้กับปุ่มรีเซต
    const resetAllBtn = document.getElementById("resetAllBtn");
    if (resetAllBtn) {
        resetAllBtn.addEventListener("click", function() {
            if (confirm("คุณแน่ใจหรือไม่ว่าต้องการรีเซตข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้")) {
                resetAllData();
            }
        });
    }

    // เพิ่มฟังก์ชันการทำงานให้กับปุ่มรีเซตเฉพาะภูมิภาค
    const resetRegionBtn = document.getElementById("resetRegionBtn");
    if (resetRegionBtn) {
        resetRegionBtn.addEventListener("click", function() {
            const region = document.getElementById("regionSelect").value;
            if (!region) {
                alert("กรุณาเลือกภูมิภาคก่อนทำการรีเซต");
                return;
            }
            
            if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการรีเซตข้อมูลสำหรับภูมิภาค ${getRegionThaiName(region)}? การกระทำนี้ไม่สามารถย้อนกลับได้`)) {
                resetRegionData(region);
            }
        });
    }

    // เพิ่มฟังก์ชันการทำงานให้กับปุ่ม Export
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
        exportBtn.addEventListener("click", exportData);
    }

    // เพิ่มฟังก์ชันการทำงานให้กับปุ่ม Import
	const importBtn = document.getElementById("importBtn");
	if (importBtn && !importBtn.hasAttribute("data-event-added")) {
    importBtn.addEventListener("click", function() {
        document.getElementById("importFile").click();
    });
    importBtn.setAttribute("data-event-added", "true");
	}

    const importFile = document.getElementById("importFile");
    if (importFile) {
        importFile.addEventListener("change", importData);
    }
});

// ฟังก์ชันรีเซตข้อมูลทั้งหมด
function resetAllData() {
    // ลบข้อมูลเฉพาะข้อมูลโปเกมอนจาก localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('pokemon_')) {
            keysToRemove.push(key);
        }
    }
    
    // ลบข้อมูลที่เกี่ยวข้อง
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // รีเซตข้อมูลสรุป
    const pokemonData = JSON.parse(localStorage.getItem("pokemonData")) || {};
    for (const region in pokemonData) {
        pokemonData[region].caught = 0;
    }
    localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
    
    // รีโหลดหน้า
    location.reload();
}

// ฟังก์ชันรีเซตข้อมูลเฉพาะภูมิภาค
function resetRegionData(region) {
    if (!region) return;
    
    // ลบข้อมูลเฉพาะภูมิภาคที่เลือก
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`pokemon_${region}_`)) {
            keysToRemove.push(key);
        }
    }
    
    // ลบข้อมูลที่เกี่ยวข้อง
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // อัปเดตข้อมูลสรุป
    const pokemonData = JSON.parse(localStorage.getItem("pokemonData")) || {};
    if (pokemonData[region]) {
        pokemonData[region].caught = 0;
        localStorage.setItem("pokemonData", JSON.stringify(pokemonData));
    }
    
    // รีโหลดหน้า
    location.reload();
}

// ฟังก์ชัน Export ข้อมูล
function exportData() {
    // รวบรวมข้อมูลทั้งหมดที่เกี่ยวข้องกับโปเกมอน
    const exportData = {
        pokemonData: JSON.parse(localStorage.getItem("pokemonData")) || {},
        caughtPokemon: {}
    };
    
    // เก็บข้อมูลโปเกมอนที่จับแล้ว
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('pokemon_')) {
            exportData.caughtPokemon[key] = localStorage.getItem(key);
        }
    }
    
    // แปลงเป็น JSON และดาวน์โหลด
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const dateStr = new Date().toISOString().slice(0, 10);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', url);
    downloadLink.setAttribute('download', `pokemon-checklist-${dateStr}.json`);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// ฟังก์ชัน Import ข้อมูล
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            if (confirm("คุณแน่ใจหรือไม่ว่าต้องการนำเข้าข้อมูลนี้? ข้อมูลปัจจุบันทั้งหมดจะถูกแทนที่")) {
                // ลบข้อมูลปัจจุบัน
                resetAllData();
                
                // นำเข้าข้อมูลใหม่
                if (importedData.pokemonData) {
                    localStorage.setItem("pokemonData", JSON.stringify(importedData.pokemonData));
                }
                
                if (importedData.caughtPokemon) {
                    for (const key in importedData.caughtPokemon) {
                        localStorage.setItem(key, importedData.caughtPokemon[key]);
                    }
                }
                
                alert("นำเข้าข้อมูลสำเร็จ!");
                location.reload();
            }
        } catch (err) {
            alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล: " + err.message);
        }
    };
    reader.readAsText(file);
    
    // รีเซตค่า input file เพื่อให้สามารถเลือกไฟล์เดิมซ้ำได้
    event.target.value = "";
}

// ฟังก์ชันแปลงชื่อภูมิภาคเป็นภาษาไทย
function getRegionThaiName(region) {
    const regionNames = {
        kanto: "คันโต",
        johto: "โจโต",
        hoenn: "โฮเอ็น",
        sinnoh: "ชินโอ",
        unova: "ยูโนวา",
        kalos: "คาลอส",
        alola: "อโลลา",
        galar: "กาลาร์",
        paldea: "พัลเดีย"
    };
    return regionNames[region] || region;
}