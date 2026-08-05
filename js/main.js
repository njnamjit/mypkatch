document.addEventListener("DOMContentLoaded", function() {
    // โหลดข้อมูลจาก localStorage
    const pokemonData = JSON.parse(localStorage.getItem("pokemonData")) || {
        kanto: { total: 151, caught: 0 },
        johto: { total: 100, caught: 0 },
        hoenn: { total: 135, caught: 0 },
        sinnoh: { total: 107, caught: 0 },
        unova: { total: 156, caught: 0 },
        kalos: { total: 72, caught: 0 },
        alola: { total: 88, caught: 0 },
        galar: { total: 96, caught: 0 },
        paldea: { total: 120, caught: 0 }
    };
    
    // คำนวณจำนวนที่จับได้ทั้งหมด
    let totalCaught = 0;
    let totalPokemon = 0;
    
    // สร้าง HTML สำหรับแต่ละภูมิภาค
    const regionSummaryEl = document.getElementById("regionSummary");
    let regionSummaryHTML = '<div class="region-grid">';
    
    // ชื่อภูมิภาคเป็นภาษาไทย
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
    
    for (const region in pokemonData) {
        const { caught, total } = pokemonData[region];
        totalCaught += caught;
        totalPokemon += total;
        
        // สร้างการ์ดสำหรับแต่ละภูมิภาค
        const percentCaught = Math.round((caught / total) * 100);
        regionSummaryHTML += `
            <div class="region-card" data-region="${region}">
                <div class="region-header">
                    <h2>${regionNames[region]}</h2>
                    <div class="region-badge">${caught}/${total}</div>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentCaught}%"></div>
                </div>
                <div class="region-footer">
                    <span class="percent">${percentCaught}%</span>
                    <a href="regions.html?region=${region}" class="view-btn">ดูรายการ</a>
                </div>
            </div>
        `;
    }
    
    regionSummaryHTML += '</div>';
    regionSummaryEl.innerHTML = regionSummaryHTML;
    
    // อัปเดตจำนวนรวมที่จับได้แล้ว
    document.getElementById("totalCaught").textContent = totalCaught;
    document.getElementById("totalPokemon").textContent = totalPokemon;
    
    // เพิ่ม Event Listener สำหรับคลิกที่การ์ดภูมิภาค
    document.querySelectorAll('.region-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.matches('.view-btn')) {
                const region = this.dataset.region;
                window.location.href = `regions.html?region=${region}`;
            }
        });
    });
});
