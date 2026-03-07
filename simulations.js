(() => {
    "use strict";

    const canvas = document.getElementById("simCanvas");
    const ctx = canvas.getContext("2d");
    const overlay = document.getElementById("info-overlay");

    let animId = null;
    let currentSim = "projectile";

    // ── Navigation ──────────────────────────────────────────
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelector(".nav-btn.active").classList.remove("active");
            btn.classList.add("active");
            document.querySelectorAll(".controls").forEach(c => c.classList.add("hidden"));
            const sim = btn.dataset.sim;
            document.getElementById("ctrl-" + sim).classList.remove("hidden");
            switchSim(sim);
        });
    });

    function switchSim(name) {
        cancelAnimationFrame(animId);
        if (lifeInterval) { clearInterval(lifeInterval); lifeInterval = null; }
        currentSim = name;
        overlay.textContent = "";
        canvas.onmousedown = null;
        canvas.oncontextmenu = null;
        switch (name) {
            case "projectile":  initProjectile();  break;
            case "pendulum":    initPendulum();    break;
            case "wave":        initWave();         break;
            case "gas":         initGas();          break;
            case "orbit":       initOrbit();        break;
            case "efield":      initEField();       break;
            case "spring":      initSpring();       break;
            case "doubleslit":  initDoubleSlit();   break;
            case "life":        initLife();         break;
            case "emspectrum":  initEMSpectrum();   break;
            case "lens":        initLens();         break;
            case "nbody":       initNBody();        break;
            case "decay":       initDecay();        break;
            case "thermo":      initThermo();       break;
        }
    }

    let lifeInterval = null;

    // Helper: bind slider to its value span
    function bindSlider(id, spanId, cb) {
        const sl = document.getElementById(id);
        const sp = document.getElementById(spanId);
        sl.addEventListener("input", () => { sp.textContent = sl.value; if (cb) cb(+sl.value); });
    }

    // ═══════════════════════════════════════════════════════
    // 1. PROJECTILE MOTION
    // ═══════════════════════════════════════════════════════
    let projState = {};

    function initProjectile() {
        projState = { launched: false, t: 0, trail: [], x0: 60, y0: canvas.height - 60 };
        drawProjectile();
    }

    function drawProjectile() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Ground
        ctx.fillStyle = "#1a2a1a";
        ctx.fillRect(0, H - 40, W, 40);
        ctx.strokeStyle = "#2a4a2a";
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 40) {
            ctx.beginPath(); ctx.moveTo(x, H - 40); ctx.lineTo(x + 20, H); ctx.stroke();
        }

        const angle = +document.getElementById("angle").value;
        const vel = +document.getElementById("velocity").value;
        const g = +document.getElementById("gravity").value;
        const { x0, y0 } = projState;
        const scale = 3.5;

        // Launcher
        const rad = angle * Math.PI / 180;
        ctx.save();
        ctx.translate(x0, y0);
        ctx.rotate(-rad);
        ctx.fillStyle = "#5c6bc0";
        ctx.fillRect(0, -4, 40, 8);
        ctx.restore();
        ctx.beginPath();
        ctx.arc(x0, y0, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#7986cb";
        ctx.fill();

        // Trail
        if (projState.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(projState.trail[0].x, projState.trail[0].y);
            for (let i = 1; i < projState.trail.length; i++) {
                ctx.lineTo(projState.trail[i].x, projState.trail[i].y);
            }
            ctx.strokeStyle = "rgba(0, 212, 255, 0.5)";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Projectile
        if (projState.launched) {
            const vx = vel * Math.cos(rad) * scale;
            const vy = vel * Math.sin(rad) * scale;
            const t = projState.t;
            const px = x0 + vx * t;
            const py = y0 - (vy * t - 0.5 * g * scale * t * t);

            if (py < y0 + 10) {
                projState.trail.push({ x: px, y: py });

                // Draw ball
                const gradient = ctx.createRadialGradient(px, py, 2, px, py, 10);
                gradient.addColorStop(0, "#ff6ec7");
                gradient.addColorStop(1, "rgba(255, 110, 199, 0.1)");
                ctx.beginPath();
                ctx.arc(px, py, 10, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(px, py, 5, 0, Math.PI * 2);
                ctx.fillStyle = "#ff6ec7";
                ctx.fill();

                // Velocity vector
                const cvx = vx;
                const cvy = -(vy - g * scale * t);
                const vmag = Math.sqrt(cvx * cvx + cvy * cvy);
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px + cvx * 0.4, py + cvy * 0.4);
                ctx.strokeStyle = "#ffeb3b";
                ctx.lineWidth = 2;
                ctx.stroke();

                // Info
                const realX = (px - x0) / scale;
                const realY = (y0 - py) / scale;
                overlay.innerHTML =
                    `<b style="color:#00d4ff">Projectile Motion</b><br>` +
                    `x: ${realX.toFixed(1)} m<br>` +
                    `y: ${realY.toFixed(1)} m<br>` +
                    `v: ${(vmag / scale).toFixed(1)} m/s<br>` +
                    `t: ${(t * 0.016).toFixed(2)} s`;

                projState.t += 0.35;
                animId = requestAnimationFrame(drawProjectile);
            } else {
                // Landed
                const realRange = (projState.trail[projState.trail.length - 1].x - x0) / scale;
                overlay.innerHTML =
                    `<b style="color:#00d4ff">Landed!</b><br>` +
                    `Range: ${realRange.toFixed(1)} m<br>` +
                    `Max Height: ${((vel * vel * Math.sin(rad) * Math.sin(rad)) / (2 * g)).toFixed(1)} m`;
            }
        } else {
            // Preview trajectory (dotted)
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            const vx = vel * Math.cos(rad) * scale;
            const vy = vel * Math.sin(rad) * scale;
            for (let t = 0; t < 200; t += 0.5) {
                const px = x0 + vx * t;
                const py = y0 - (vy * t - 0.5 * g * scale * t * t);
                if (py > y0 || px > W) break;
                if (t === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = "rgba(92, 107, 192, 0.3)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);

            overlay.innerHTML =
                `<b style="color:#00d4ff">Projectile Motion</b><br>` +
                `Angle: ${angle}&deg;<br>` +
                `Velocity: ${vel} m/s<br>` +
                `Gravity: ${g} m/s&sup2;<br>` +
                `<i>Press Launch</i>`;
        }
    }

    bindSlider("angle", "val-angle", () => { if (!projState.launched) { cancelAnimationFrame(animId); drawProjectile(); } });
    bindSlider("velocity", "val-velocity", () => { if (!projState.launched) { cancelAnimationFrame(animId); drawProjectile(); } });
    bindSlider("gravity", "val-gravity", () => { if (!projState.launched) { cancelAnimationFrame(animId); drawProjectile(); } });

    document.getElementById("btn-launch").addEventListener("click", () => {
        projState = { launched: true, t: 0, trail: [], x0: 60, y0: canvas.height - 60 };
        drawProjectile();
    });
    document.getElementById("btn-reset-proj").addEventListener("click", initProjectile);

    // ═══════════════════════════════════════════════════════
    // 2. PENDULUM
    // ═══════════════════════════════════════════════════════
    let pendState = {};

    function initPendulum() {
        const angle = +document.getElementById("pendAngle").value * Math.PI / 180;
        pendState = { angle, angVel: 0, running: false };
        drawPendulum();
    }

    function drawPendulum() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const len = +document.getElementById("pendLength").value;
        const damp = +document.getElementById("damping").value;
        const g = 0.4;
        const pivotX = W / 2, pivotY = 80;

        if (pendState.running) {
            const acc = -(g / len) * Math.sin(pendState.angle) * 100;
            pendState.angVel += acc;
            pendState.angVel *= damp;
            pendState.angle += pendState.angVel;
        }

        const bobX = pivotX + len * Math.sin(pendState.angle);
        const bobY = pivotY + len * Math.cos(pendState.angle);

        // Pivot support
        ctx.fillStyle = "#2a2f6e";
        ctx.fillRect(pivotX - 40, 0, 80, 12);
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#5c6bc0";
        ctx.fill();

        // String
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = "#8888aa";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Bob
        const grad = ctx.createRadialGradient(bobX - 4, bobY - 4, 2, bobX, bobY, 22);
        grad.addColorStop(0, "#ff8a65");
        grad.addColorStop(1, "#d84315");
        ctx.beginPath();
        ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Shadow / arc guide
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, len, Math.PI / 2 - 0.8, Math.PI / 2 + 0.8);
        ctx.strokeStyle = "rgba(100,100,150,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Energy bar
        const KE = 0.5 * pendState.angVel * pendState.angVel * len * len;
        const maxAngle = +document.getElementById("pendAngle").value * Math.PI / 180;
        const maxPE = g * len * (1 - Math.cos(maxAngle));
        const PE = g * len * (1 - Math.cos(pendState.angle));
        const totalE = maxPE || 1;
        const barW = 150;
        ctx.fillStyle = "#1a1d4a";
        ctx.fillRect(20, H - 60, barW, 16);
        ctx.fillStyle = "#4caf50";
        ctx.fillRect(20, H - 60, barW * Math.min(KE / totalE, 1), 16);
        ctx.fillStyle = "#1a1d4a";
        ctx.fillRect(20, H - 36, barW, 16);
        ctx.fillStyle = "#ff9800";
        ctx.fillRect(20, H - 36, barW * Math.min(PE / totalE, 1), 16);
        ctx.fillStyle = "#aab";
        ctx.font = "11px sans-serif";
        ctx.fillText("KE", 175, H - 49);
        ctx.fillText("PE", 175, H - 25);

        const deg = (pendState.angle * 180 / Math.PI).toFixed(1);
        overlay.innerHTML =
            `<b style="color:#ff8a65">Pendulum</b><br>` +
            `Angle: ${deg}&deg;<br>` +
            `Length: ${len} px<br>` +
            `Damping: ${damp}`;

        if (pendState.running) {
            animId = requestAnimationFrame(drawPendulum);
        }
    }

    bindSlider("pendLength", "val-length", () => { if (!pendState.running) { initPendulum(); } });
    bindSlider("pendAngle", "val-pendAngle", () => { if (!pendState.running) { initPendulum(); } });
    bindSlider("damping", "val-damping");

    document.getElementById("btn-pend-start").addEventListener("click", () => {
        if (!pendState.running) {
            pendState.running = true;
            drawPendulum();
        }
    });
    document.getElementById("btn-pend-reset").addEventListener("click", initPendulum);

    // ═══════════════════════════════════════════════════════
    // 3. WAVE INTERFERENCE
    // ═══════════════════════════════════════════════════════
    let waveState = { t: 0, running: true };

    function initWave() {
        waveState = { t: 0, running: true };
        document.getElementById("btn-wave-toggle").textContent = "Pause";
        drawWave();
    }

    function drawWave() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const freq1 = +document.getElementById("freq1").value;
        const freq2 = +document.getElementById("freq2").value;
        const amp = +document.getElementById("amplitude").value;
        const t = waveState.t;

        const midY = H / 2;
        const yOff1 = -110, yOff2 = 0, yOff3 = 110;

        // Wave 1
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
            const y = midY + yOff1 + amp * 0.6 * Math.sin(freq1 * x + t * 0.05);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "#42a5f5";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Wave 2
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
            const y = midY + yOff1 + amp * 0.6 * Math.sin(freq2 * x + t * 0.05);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "#ef5350";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Labels
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#42a5f5";
        ctx.fillText("Wave 1 (f=" + freq1 + ")", 14, midY + yOff1 - amp * 0.6 - 10);
        ctx.fillStyle = "#ef5350";
        ctx.fillText("Wave 2 (f=" + freq2 + ")", 14, midY + yOff1 + amp * 0.6 + 18);

        // Superposition
        ctx.fillStyle = "#aab";
        ctx.font = "13px sans-serif";
        ctx.fillText("Superposition (Wave 1 + Wave 2)", 14, midY + yOff2 - amp - 10);

        ctx.beginPath();
        for (let x = 0; x < W; x++) {
            const y1 = amp * 0.6 * Math.sin(freq1 * x + t * 0.05);
            const y2 = amp * 0.6 * Math.sin(freq2 * x + t * 0.05);
            const y = midY + yOff2 + y1 + y2;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "#ab47bc";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Fill under superposition
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
            const y1 = amp * 0.6 * Math.sin(freq1 * x + t * 0.05);
            const y2 = amp * 0.6 * Math.sin(freq2 * x + t * 0.05);
            const y = midY + yOff2 + y1 + y2;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(W, midY + yOff2);
        ctx.lineTo(0, midY + yOff2);
        ctx.closePath();
        ctx.fillStyle = "rgba(171, 71, 188, 0.1)";
        ctx.fill();

        // Beat pattern envelope
        ctx.fillStyle = "#aab";
        ctx.fillText("Beat Pattern Envelope", 14, midY + yOff3 - 55);
        const beatFreq = Math.abs(freq1 - freq2) / 2;
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
            const env = 2 * amp * 0.6 * Math.abs(Math.cos(beatFreq * x + t * 0.025));
            const y = midY + yOff3 - env * 0.5;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        for (let x = W - 1; x >= 0; x--) {
            const env = 2 * amp * 0.6 * Math.abs(Math.cos(beatFreq * x + t * 0.025));
            const y = midY + yOff3 + env * 0.5;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(255, 183, 77, 0.15)";
        ctx.fill();
        ctx.strokeStyle = "#ffb74d";
        ctx.lineWidth = 1;
        ctx.stroke();

        overlay.innerHTML =
            `<b style="color:#ab47bc">Wave Interference</b><br>` +
            `f1: ${freq1}<br>` +
            `f2: ${freq2}<br>` +
            `Beat freq: ${(Math.abs(freq1 - freq2)).toFixed(3)}`;

        if (waveState.running) {
            waveState.t++;
            animId = requestAnimationFrame(drawWave);
        }
    }

    bindSlider("freq1", "val-freq1");
    bindSlider("freq2", "val-freq2");
    bindSlider("amplitude", "val-amp");

    document.getElementById("btn-wave-toggle").addEventListener("click", () => {
        waveState.running = !waveState.running;
        document.getElementById("btn-wave-toggle").textContent = waveState.running ? "Pause" : "Resume";
        if (waveState.running) drawWave();
    });

    // ═══════════════════════════════════════════════════════
    // 4. GAS PARTICLES (CHEMISTRY)
    // ═══════════════════════════════════════════════════════
    let gasParticles = [];

    function initGas() {
        const n = +document.getElementById("numParticles").value;
        const temp = +document.getElementById("temperature").value;
        const W = canvas.width, H = canvas.height;
        gasParticles = [];
        for (let i = 0; i < n; i++) {
            const speed = Math.sqrt(temp / 100) * (1 + Math.random());
            const angle = Math.random() * Math.PI * 2;
            gasParticles.push({
                x: 40 + Math.random() * (W - 80),
                y: 40 + Math.random() * (H - 80),
                vx: speed * Math.cos(angle),
                vy: speed * Math.sin(angle),
                r: 3 + Math.random() * 3,
                hue: Math.floor(Math.random() * 360)
            });
        }
        drawGas();
    }

    function drawGas() {
        const W = canvas.width, H = canvas.height;
        const temp = +document.getElementById("temperature").value;
        ctx.clearRect(0, 0, W, H);

        // Container walls
        const wall = 20;
        ctx.strokeStyle = "#3949ab";
        ctx.lineWidth = 3;
        ctx.strokeRect(wall, wall, W - wall * 2, H - wall * 2);

        // Corner decorations
        const cs = 12;
        ctx.fillStyle = "#3949ab";
        [[wall, wall], [W - wall, wall], [wall, H - wall], [W - wall, H - wall]].forEach(([cx, cy]) => {
            ctx.beginPath(); ctx.arc(cx, cy, cs, 0, Math.PI * 2); ctx.fill();
        });

        let totalSpeed = 0;
        let collisions = 0;

        // Update & draw particles
        gasParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Wall bounce
            if (p.x - p.r < wall)     { p.x = wall + p.r; p.vx *= -1; collisions++; }
            if (p.x + p.r > W - wall) { p.x = W - wall - p.r; p.vx *= -1; collisions++; }
            if (p.y - p.r < wall)     { p.y = wall + p.r; p.vy *= -1; collisions++; }
            if (p.y + p.r > H - wall) { p.y = H - wall - p.r; p.vy *= -1; collisions++; }

            // Adjust speed toward temperature
            const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const target = Math.sqrt(temp / 100) * 1.5;
            const factor = 1 + (target - spd) * 0.01;
            p.vx *= factor;
            p.vy *= factor;

            totalSpeed += Math.sqrt(p.vx * p.vx + p.vy * p.vy);

            // Draw particle with speed-based color
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            const hue = Math.max(0, 240 - speed * 40);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.9)`;
            ctx.fill();

            // Glow for fast particles
            if (speed > 4) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r + 4, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.15)`;
                ctx.fill();
            }
        });

        const avgSpeed = totalSpeed / gasParticles.length;
        const pressure = (collisions * avgSpeed).toFixed(0);

        overlay.innerHTML =
            `<b style="color:#ff7043">Gas Simulation</b><br>` +
            `Particles: ${gasParticles.length}<br>` +
            `Temperature: ${temp} K<br>` +
            `Avg Speed: ${avgSpeed.toFixed(1)}<br>` +
            `Pressure: ${pressure}`;

        document.getElementById("gas-stats").innerHTML =
            `Avg Speed: <b>${avgSpeed.toFixed(2)}</b> | ` +
            `Pressure index: <b>${pressure}</b>`;

        animId = requestAnimationFrame(drawGas);
    }

    bindSlider("numParticles", "val-particles", () => initGas());
    bindSlider("temperature", "val-temp");
    document.getElementById("btn-gas-reset").addEventListener("click", initGas);

    // ═══════════════════════════════════════════════════════
    // 5. ORBITAL MECHANICS (ASTRONOMY)
    // ═══════════════════════════════════════════════════════
    let orbitState = {};

    function initOrbit() {
        const vel = +document.getElementById("orbVel").value;
        orbitState = {
            // Sun at center
            sx: canvas.width / 2,
            sy: canvas.height / 2,
            // Planet
            px: canvas.width / 2 + 180,
            py: canvas.height / 2,
            vx: 0,
            vy: -2.8 * vel,
            trail: [],
            // Moon
            moonAngle: 0,
        };
        drawOrbit();
    }

    function drawOrbit() {
        const W = canvas.width, H = canvas.height;
        const mass = +document.getElementById("planetMass").value;
        const showTrail = document.getElementById("showTrail").checked;
        ctx.clearRect(0, 0, W, H);

        // Starfield (static)
        const seed = 42;
        for (let i = 0; i < 120; i++) {
            const sx = ((i * 7919 + seed) % W);
            const sy = ((i * 6271 + seed) % H);
            const bright = 0.2 + (i % 5) * 0.15;
            ctx.beginPath();
            ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${bright})`;
            ctx.fill();
        }

        const { sx, sy } = orbitState;
        const G = 800 * mass;

        // Gravity
        const dx = sx - orbitState.px;
        const dy = sy - orbitState.py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = G / (dist * dist);
        const ax = force * dx / dist;
        const ay = force * dy / dist;

        orbitState.vx += ax;
        orbitState.vy += ay;
        orbitState.px += orbitState.vx;
        orbitState.py += orbitState.vy;

        // Trail
        orbitState.trail.push({ x: orbitState.px, y: orbitState.py });
        if (orbitState.trail.length > 600) orbitState.trail.shift();

        if (showTrail && orbitState.trail.length > 2) {
            for (let i = 1; i < orbitState.trail.length; i++) {
                const alpha = i / orbitState.trail.length * 0.6;
                ctx.beginPath();
                ctx.moveTo(orbitState.trail[i - 1].x, orbitState.trail[i - 1].y);
                ctx.lineTo(orbitState.trail[i].x, orbitState.trail[i].y);
                ctx.strokeStyle = `rgba(100, 180, 255, ${alpha})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }

        // Sun with glow
        const sunGrad = ctx.createRadialGradient(sx, sy, 5, sx, sy, 45);
        sunGrad.addColorStop(0, "#fff176");
        sunGrad.addColorStop(0.3, "#ffb300");
        sunGrad.addColorStop(0.7, "rgba(255, 152, 0, 0.3)");
        sunGrad.addColorStop(1, "rgba(255, 152, 0, 0)");
        ctx.beginPath();
        ctx.arc(sx, sy, 45, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx, sy, 18, 0, Math.PI * 2);
        ctx.fillStyle = "#fff176";
        ctx.fill();

        // Planet
        const pGrad = ctx.createRadialGradient(
            orbitState.px - 3, orbitState.py - 3, 1,
            orbitState.px, orbitState.py, 12
        );
        pGrad.addColorStop(0, "#64b5f6");
        pGrad.addColorStop(1, "#1565c0");
        ctx.beginPath();
        ctx.arc(orbitState.px, orbitState.py, 12, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();

        // Moon orbiting planet
        orbitState.moonAngle += 0.06;
        const moonDist = 26;
        const mx = orbitState.px + moonDist * Math.cos(orbitState.moonAngle);
        const my = orbitState.py + moonDist * Math.sin(orbitState.moonAngle);
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#bdbdbd";
        ctx.fill();

        // Velocity vector
        ctx.beginPath();
        ctx.moveTo(orbitState.px, orbitState.py);
        ctx.lineTo(orbitState.px + orbitState.vx * 8, orbitState.py + orbitState.vy * 8);
        ctx.strokeStyle = "#66bb6a";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Gravity vector
        ctx.beginPath();
        ctx.moveTo(orbitState.px, orbitState.py);
        ctx.lineTo(orbitState.px + ax * 120, orbitState.py + ay * 120);
        ctx.strokeStyle = "#ef5350";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Legend
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "#66bb6a"; ctx.fillText("── Velocity", W - 130, H - 36);
        ctx.fillStyle = "#ef5350"; ctx.fillText("- - Gravity", W - 130, H - 20);

        const speed = Math.sqrt(orbitState.vx ** 2 + orbitState.vy ** 2);
        overlay.innerHTML =
            `<b style="color:#fff176">Orbital Mechanics</b><br>` +
            `Distance: ${dist.toFixed(0)} px<br>` +
            `Speed: ${speed.toFixed(2)}<br>` +
            `Mass: ${mass}x`;

        // Check if planet flew off screen — reset if so
        if (orbitState.px < -200 || orbitState.px > W + 200 || orbitState.py < -200 || orbitState.py > H + 200) {
            initOrbit();
            return;
        }

        animId = requestAnimationFrame(drawOrbit);
    }

    bindSlider("planetMass", "val-pmass");
    bindSlider("orbVel", "val-ovel");
    document.getElementById("btn-orbit-reset").addEventListener("click", initOrbit);

    // ═══════════════════════════════════════════════════════
    // 6. ELECTRIC FIELD VISUALIZATION
    // ═══════════════════════════════════════════════════════
    let charges = [];

    function initEField() {
        charges = [
            { x: 350, y: 260, q: 1 },
            { x: 550, y: 260, q: -1 }
        ];
        canvas.oncontextmenu = e => e.preventDefault();
        canvas.onmousedown = e => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            const q = (e.button === 2 || e.shiftKey) ? -1 : 1;
            charges.push({ x, y, q });
            drawEField();
        };
        drawEField();
    }

    function eFieldAt(x, y) {
        let ex = 0, ey = 0;
        for (const c of charges) {
            const dx = x - c.x, dy = y - c.y;
            const r2 = dx * dx + dy * dy;
            if (r2 < 100) continue;
            const r = Math.sqrt(r2);
            const f = c.q * 5000 / r2;
            ex += f * dx / r;
            ey += f * dy / r;
        }
        return { ex, ey };
    }

    function drawEField() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const density = +document.getElementById("fieldDensity").value;
        const showVec = document.getElementById("showVectors").checked;

        // Field lines from each positive charge
        for (const c of charges) {
            if (c.q <= 0) continue;
            for (let i = 0; i < density; i++) {
                const angle = (i / density) * Math.PI * 2;
                let lx = c.x + 15 * Math.cos(angle);
                let ly = c.y + 15 * Math.sin(angle);
                ctx.beginPath();
                ctx.moveTo(lx, ly);
                for (let step = 0; step < 300; step++) {
                    const { ex, ey } = eFieldAt(lx, ly);
                    const mag = Math.sqrt(ex * ex + ey * ey);
                    if (mag < 0.01) break;
                    lx += (ex / mag) * 4;
                    ly += (ey / mag) * 4;
                    if (lx < 0 || lx > W || ly < 0 || ly > H) break;
                    ctx.lineTo(lx, ly);
                    // Stop near a negative charge
                    let nearNeg = false;
                    for (const c2 of charges) {
                        if (c2.q < 0) {
                            const d2 = (lx - c2.x) ** 2 + (ly - c2.y) ** 2;
                            if (d2 < 225) { nearNeg = true; break; }
                        }
                    }
                    if (nearNeg) break;
                }
                ctx.strokeStyle = "rgba(100, 200, 255, 0.25)";
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }
        }

        // Vector field grid
        if (showVec) {
            const step = 40;
            for (let gx = step; gx < W; gx += step) {
                for (let gy = step; gy < H; gy += step) {
                    let tooClose = false;
                    for (const c of charges) {
                        if ((gx - c.x) ** 2 + (gy - c.y) ** 2 < 900) { tooClose = true; break; }
                    }
                    if (tooClose) continue;
                    const { ex, ey } = eFieldAt(gx, gy);
                    const mag = Math.sqrt(ex * ex + ey * ey);
                    if (mag < 0.02) continue;
                    const len = Math.min(mag * 8, 18);
                    const ax = (ex / mag) * len, ay = (ey / mag) * len;
                    ctx.beginPath();
                    ctx.moveTo(gx, gy);
                    ctx.lineTo(gx + ax, gy + ay);
                    const alpha = Math.min(mag * 2, 0.7);
                    ctx.strokeStyle = `rgba(255, 235, 59, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Draw charges
        for (const c of charges) {
            const grad = ctx.createRadialGradient(c.x, c.y, 3, c.x, c.y, 18);
            if (c.q > 0) {
                grad.addColorStop(0, "#ff5252");
                grad.addColorStop(1, "rgba(255,82,82,0.1)");
            } else {
                grad.addColorStop(0, "#448aff");
                grad.addColorStop(1, "rgba(68,138,255,0.1)");
            }
            ctx.beginPath();
            ctx.arc(c.x, c.y, 18, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(c.x, c.y, 12, 0, Math.PI * 2);
            ctx.fillStyle = c.q > 0 ? "#ff5252" : "#448aff";
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(c.q > 0 ? "+" : "\u2212", c.x, c.y);
            ctx.textAlign = "start";
            ctx.textBaseline = "alphabetic";
        }

        overlay.innerHTML =
            `<b style="color:#ffeb3b">Electric Field</b><br>` +
            `Charges: ${charges.length}<br>` +
            `+ : ${charges.filter(c => c.q > 0).length}<br>` +
            `\u2212 : ${charges.filter(c => c.q < 0).length}`;
    }

    bindSlider("fieldDensity", "val-fieldDensity", () => { if (currentSim === "efield") drawEField(); });
    document.getElementById("showVectors").addEventListener("change", () => { if (currentSim === "efield") drawEField(); });
    document.getElementById("btn-efield-clear").addEventListener("click", () => { charges = []; drawEField(); });

    // ═══════════════════════════════════════════════════════
    // 7. SPRING / HARMONIC OSCILLATOR
    // ═══════════════════════════════════════════════════════
    let springState = {};

    function initSpring() {
        springState = { x: 200, v: 0, running: false, history: [] };
        drawSpring();
    }

    function drawSpring() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const k = +document.getElementById("springK").value;
        const m = +document.getElementById("springMass").value;
        const damp = +document.getElementById("springDamp").value;
        const anchorX = 100, anchorY = 200;
        const restLen = 200;

        if (springState.running) {
            const force = -k * springState.x / m;
            springState.v += force;
            springState.v *= damp;
            springState.x += springState.v;
            springState.history.push(springState.x);
            if (springState.history.length > 500) springState.history.shift();
        }

        const bobX = anchorX + restLen + springState.x;
        const bobY = anchorY;

        // Wall
        ctx.fillStyle = "#2a2f6e";
        ctx.fillRect(anchorX - 10, anchorY - 60, 10, 120);
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(anchorX - 10, anchorY - 50 + i * 20);
            ctx.lineTo(anchorX - 20, anchorY - 40 + i * 20);
            ctx.strokeStyle = "#3949ab";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Spring coils
        const coils = 14;
        const springLen = bobX - anchorX - 15;
        ctx.beginPath();
        ctx.moveTo(anchorX, anchorY);
        for (let i = 0; i <= coils; i++) {
            const px = anchorX + (springLen * i) / coils;
            const py = anchorY + (i % 2 === 0 ? -14 : 14);
            ctx.lineTo(px, py);
        }
        ctx.lineTo(bobX - 15, anchorY);
        const compression = Math.abs(springState.x) / 200;
        const springHue = 120 - compression * 120;
        ctx.strokeStyle = `hsl(${springHue}, 70%, 55%)`;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Equilibrium line
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(anchorX + restLen, anchorY - 70);
        ctx.lineTo(anchorX + restLen, anchorY + 70);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#556";
        ctx.font = "10px sans-serif";
        ctx.fillText("equilibrium", anchorX + restLen - 28, anchorY + 82);

        // Bob
        const bobSize = 14 + m * 8;
        const grad = ctx.createRadialGradient(bobX - 3, bobY - 3, 2, bobX, bobY, bobSize);
        grad.addColorStop(0, "#ce93d8");
        grad.addColorStop(1, "#6a1b9a");
        ctx.beginPath();
        ctx.arc(bobX, bobY, bobSize, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Force arrow
        if (springState.running && Math.abs(springState.x) > 2) {
            const fDir = springState.x > 0 ? -1 : 1;
            const fLen = Math.min(Math.abs(springState.x) * 0.5, 60);
            ctx.beginPath();
            ctx.moveTo(bobX, bobY);
            ctx.lineTo(bobX + fDir * fLen, bobY);
            ctx.strokeStyle = "#ef5350";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Arrowhead
            ctx.beginPath();
            ctx.moveTo(bobX + fDir * fLen, bobY);
            ctx.lineTo(bobX + fDir * (fLen - 8), bobY - 5);
            ctx.lineTo(bobX + fDir * (fLen - 8), bobY + 5);
            ctx.closePath();
            ctx.fillStyle = "#ef5350";
            ctx.fill();
        }

        // Position-time graph
        const graphY = 380, graphH = 100, graphX = 60, graphW = W - 120;
        ctx.fillStyle = "rgba(16, 20, 58, 0.8)";
        ctx.fillRect(graphX, graphY, graphW, graphH);
        ctx.strokeStyle = "#2a2f6e";
        ctx.lineWidth = 1;
        ctx.strokeRect(graphX, graphY, graphW, graphH);

        // Zero line
        ctx.beginPath();
        ctx.moveTo(graphX, graphY + graphH / 2);
        ctx.lineTo(graphX + graphW, graphY + graphH / 2);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.stroke();

        ctx.fillStyle = "#aab";
        ctx.font = "11px sans-serif";
        ctx.fillText("Position vs Time", graphX, graphY - 6);

        if (springState.history.length > 1) {
            ctx.beginPath();
            for (let i = 0; i < springState.history.length; i++) {
                const gx = graphX + (i / 500) * graphW;
                const gy = graphY + graphH / 2 - (springState.history[i] / 250) * (graphH / 2);
                i === 0 ? ctx.moveTo(gx, gy) : ctx.lineTo(gx, gy);
            }
            ctx.strokeStyle = "#ce93d8";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        const period = 2 * Math.PI * Math.sqrt(m / (k * 60));
        overlay.innerHTML =
            `<b style="color:#ce93d8">Spring Oscillator</b><br>` +
            `x: ${springState.x.toFixed(1)}<br>` +
            `v: ${springState.v.toFixed(2)}<br>` +
            `k: ${k} | m: ${m}<br>` +
            `T \u2248 ${period.toFixed(1)} frames`;

        if (springState.running) {
            animId = requestAnimationFrame(drawSpring);
        }
    }

    bindSlider("springK", "val-springK", () => { if (!springState.running) drawSpring(); });
    bindSlider("springMass", "val-springMass", () => { if (!springState.running) drawSpring(); });
    bindSlider("springDamp", "val-springDamp");

    document.getElementById("btn-spring-start").addEventListener("click", () => {
        if (!springState.running) {
            springState.running = true;
            springState.x = 150;
            springState.v = 0;
            springState.history = [];
            drawSpring();
        }
    });
    document.getElementById("btn-spring-reset").addEventListener("click", initSpring);

    // ═══════════════════════════════════════════════════════
    // 8. DOUBLE SLIT EXPERIMENT
    // ═══════════════════════════════════════════════════════
    let dsState = { t: 0, running: true };

    function initDoubleSlit() {
        dsState = { t: 0, running: true };
        document.getElementById("btn-ds-toggle").textContent = "Pause";
        drawDoubleSlit();
    }

    function drawDoubleSlit() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const wavelength = +document.getElementById("wavelength").value;
        const slitSep = +document.getElementById("slitSep").value;
        const slitW = +document.getElementById("slitWidth").value;
        const t = dsState.t;

        const wallX = 250;
        const slit1Y = H / 2 - slitSep / 2;
        const slit2Y = H / 2 + slitSep / 2;

        // Draw wave source (left side)
        for (let r = 10; r < wallX; r += wavelength) {
            const phase = (r - t * 2) % wavelength;
            if (phase < 0) continue;
            const alpha = Math.max(0, 0.3 - r / (wallX * 2));
            ctx.beginPath();
            ctx.arc(20, H / 2, r, -Math.PI / 2, Math.PI / 2);
            ctx.strokeStyle = `rgba(66, 165, 245, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Source marker
        ctx.beginPath();
        ctx.arc(20, H / 2, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#42a5f5";
        ctx.fill();

        // Wall with slits
        ctx.fillStyle = "#37474f";
        ctx.fillRect(wallX, 0, 12, slit1Y - slitW / 2);
        ctx.fillRect(wallX, slit1Y + slitW / 2, 12, slit2Y - slitW / 2 - slit1Y - slitW / 2);
        ctx.fillRect(wallX, slit2Y + slitW / 2, 12, H - slit2Y - slitW / 2);

        // Slit glow
        ctx.fillStyle = "rgba(66, 165, 245, 0.4)";
        ctx.fillRect(wallX, slit1Y - slitW / 2, 12, slitW);
        ctx.fillRect(wallX, slit2Y - slitW / 2, 12, slitW);

        // Interference pattern (right side) using wave superposition
        const screenX = wallX + 12;
        const imgData = ctx.createImageData(W - screenX, H);

        for (let py = 0; py < H; py++) {
            for (let px = 0; px < W - screenX; px++) {
                const x = px + screenX;
                const y = py;

                // Distance from each slit
                const d1 = Math.sqrt((x - wallX - 12) ** 2 + (y - slit1Y) ** 2);
                const d2 = Math.sqrt((x - wallX - 12) ** 2 + (y - slit2Y) ** 2);

                // Superposition of two circular waves
                const k = 2 * Math.PI / wavelength;
                const w1 = Math.sin(k * d1 - t * 0.15);
                const w2 = Math.sin(k * d2 - t * 0.15);
                const amp = (w1 + w2) / 2;

                // Fade with distance
                const dist = Math.sqrt(px * px + (y - H / 2) ** 2);
                const fade = Math.max(0, 1 - dist / (W * 0.7));

                const intensity = amp * amp * fade;
                const idx = (py * (W - screenX) + px) * 4;
                imgData.data[idx] = Math.floor(intensity * 80);
                imgData.data[idx + 1] = Math.floor(intensity * 180);
                imgData.data[idx + 2] = Math.floor(intensity * 255);
                imgData.data[idx + 3] = Math.floor(intensity * 220);
            }
        }
        ctx.putImageData(imgData, screenX, 0);

        // Detection screen on far right
        const detX = W - 30;
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(detX, 0, 30, H);
        for (let y = 0; y < H; y++) {
            const d1 = Math.sqrt((detX - wallX - 12) ** 2 + (y - slit1Y) ** 2);
            const d2 = Math.sqrt((detX - wallX - 12) ** 2 + (y - slit2Y) ** 2);
            const k = 2 * Math.PI / wavelength;
            const w1 = Math.cos(k * d1);
            const w2 = Math.cos(k * d2);
            const intensity = ((w1 + w2) / 2) ** 2;
            ctx.fillStyle = `rgba(100, 200, 255, ${intensity * 0.9})`;
            ctx.fillRect(detX, y, 30, 1);
        }

        overlay.innerHTML =
            `<b style="color:#42a5f5">Double Slit</b><br>` +
            `\u03bb: ${wavelength} px<br>` +
            `Slit sep: ${slitSep} px<br>` +
            `Slit width: ${slitW} px`;

        if (dsState.running) {
            dsState.t++;
            animId = requestAnimationFrame(drawDoubleSlit);
        }
    }

    bindSlider("wavelength", "val-wavelength");
    bindSlider("slitSep", "val-slitSep");
    bindSlider("slitWidth", "val-slitWidth");

    document.getElementById("btn-ds-toggle").addEventListener("click", () => {
        dsState.running = !dsState.running;
        document.getElementById("btn-ds-toggle").textContent = dsState.running ? "Pause" : "Resume";
        if (dsState.running) drawDoubleSlit();
    });
    document.getElementById("btn-ds-reset").addEventListener("click", initDoubleSlit);

    // ═══════════════════════════════════════════════════════
    // 9. CONWAY'S GAME OF LIFE
    // ═══════════════════════════════════════════════════════
    const CELL = 8;
    const COLS = Math.floor(canvas.width / CELL);
    const ROWS = Math.floor(canvas.height / CELL);
    let lifeGrid = [];
    let lifeGen = 0;
    let lifeRunning = false;

    function makeGrid() {
        return Array.from({ length: ROWS }, () => new Uint8Array(COLS));
    }

    function initLife() {
        lifeGrid = makeGrid();
        lifeGen = 0;
        lifeRunning = false;
        if (lifeInterval) { clearInterval(lifeInterval); lifeInterval = null; }
        document.getElementById("btn-life-toggle").textContent = "Start";

        canvas.onmousedown = e => {
            if (lifeRunning) return;
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const col = Math.floor((e.clientX - rect.left) * scaleX / CELL);
            const row = Math.floor((e.clientY - rect.top) * scaleY / CELL);
            if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
                lifeGrid[row][col] = lifeGrid[row][col] ? 0 : 1;
                drawLife();
            }
        };

        drawLife();
    }

    function stepLife() {
        const next = makeGrid();
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                let n = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        const nr = (r + dr + ROWS) % ROWS;
                        const nc = (c + dc + COLS) % COLS;
                        n += lifeGrid[nr][nc];
                    }
                }
                if (lifeGrid[r][c]) {
                    next[r][c] = (n === 2 || n === 3) ? 1 : 0;
                } else {
                    next[r][c] = (n === 3) ? 1 : 0;
                }
            }
        }
        lifeGrid = next;
        lifeGen++;
    }

    function drawLife() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        // Grid lines
        ctx.strokeStyle = "rgba(42, 47, 110, 0.3)";
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= W; x += CELL) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y <= H; y += CELL) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }

        // Cells
        let alive = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (lifeGrid[r][c]) {
                    alive++;
                    // Color based on neighbor count for visual interest
                    let n = 0;
                    for (let dr = -1; dr <= 1; dr++) {
                        for (let dc = -1; dc <= 1; dc++) {
                            if (dr === 0 && dc === 0) continue;
                            const nr = (r + dr + ROWS) % ROWS;
                            const nc = (c + dc + COLS) % COLS;
                            n += lifeGrid[nr][nc];
                        }
                    }
                    const hue = 120 + n * 30;
                    ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
                    ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
                }
            }
        }

        overlay.innerHTML =
            `<b style="color:#66bb6a">Game of Life</b><br>` +
            `Generation: ${lifeGen}<br>` +
            `Alive: ${alive}<br>` +
            `Grid: ${COLS}x${ROWS}`;

        document.getElementById("life-stats").innerHTML =
            `Gen: <b>${lifeGen}</b> | Alive: <b>${alive}</b> / ${COLS * ROWS}`;
    }

    function lifeLoop() {
        stepLife();
        drawLife();
    }

    bindSlider("lifeSpeed", "val-lifeSpeed", val => {
        if (lifeRunning && lifeInterval) {
            clearInterval(lifeInterval);
            lifeInterval = setInterval(lifeLoop, 1000 / val);
        }
    });

    document.getElementById("btn-life-toggle").addEventListener("click", () => {
        lifeRunning = !lifeRunning;
        document.getElementById("btn-life-toggle").textContent = lifeRunning ? "Pause" : "Start";
        if (lifeRunning) {
            const speed = +document.getElementById("lifeSpeed").value;
            lifeInterval = setInterval(lifeLoop, 1000 / speed);
        } else {
            if (lifeInterval) { clearInterval(lifeInterval); lifeInterval = null; }
        }
    });

    document.getElementById("btn-life-random").addEventListener("click", () => {
        lifeGrid = makeGrid();
        lifeGen = 0;
        for (let r = 0; r < ROWS; r++)
            for (let c = 0; c < COLS; c++)
                lifeGrid[r][c] = Math.random() < 0.3 ? 1 : 0;
        drawLife();
    });

    document.getElementById("btn-life-glider").addEventListener("click", () => {
        lifeGrid = makeGrid();
        lifeGen = 0;
        // Gosper Glider Gun
        const gun = [
            [5,1],[5,2],[6,1],[6,2],
            [3,13],[3,14],[4,12],[4,16],[5,11],[5,17],[6,11],[6,15],[6,17],[6,18],[7,11],[7,17],[8,12],[8,16],[9,13],[9,14],
            [1,25],[2,23],[2,25],[3,21],[3,22],[4,21],[4,22],[5,21],[5,22],[6,23],[6,25],[7,25],
            [3,35],[3,36],[4,35],[4,36]
        ];
        gun.forEach(([r, c]) => {
            if (r < ROWS && c < COLS) lifeGrid[r][c] = 1;
        });
        drawLife();
    });

    document.getElementById("btn-life-clear").addEventListener("click", () => {
        lifeGrid = makeGrid();
        lifeGen = 0;
        lifeRunning = false;
        if (lifeInterval) { clearInterval(lifeInterval); lifeInterval = null; }
        document.getElementById("btn-life-toggle").textContent = "Start";
        drawLife();
    });

    // ═══════════════════════════════════════════════════════
    // 10. ELECTROMAGNETIC SPECTRUM
    // ═══════════════════════════════════════════════════════
    let emState = { t: 0, running: true };

    function initEMSpectrum() {
        emState = { t: 0, running: true };
        drawEMSpectrum();
    }

    function freqToColor(logFreq) {
        // Map visible light range ~14.0 - 14.85 log Hz
        if (logFreq < 14.0 || logFreq > 14.85) return null;
        const t = (logFreq - 14.0) / 0.85; // 0=red, 1=violet
        let r, g, b;
        if (t < 0.17) { r = 255; g = Math.floor(t / 0.17 * 165); b = 0; }           // red-orange
        else if (t < 0.33) { r = 255; g = 165 + Math.floor((t - 0.17) / 0.16 * 90); b = 0; } // orange-yellow
        else if (t < 0.50) { r = Math.floor(255 - (t - 0.33) / 0.17 * 255); g = 255; b = 0; } // yellow-green
        else if (t < 0.67) { r = 0; g = Math.floor(255 - (t - 0.50) / 0.17 * 128); b = Math.floor((t - 0.50) / 0.17 * 255); } // green-blue
        else if (t < 0.83) { r = Math.floor((t - 0.67) / 0.16 * 75); g = 0; b = 255; } // blue-indigo
        else { r = Math.floor(75 + (t - 0.83) / 0.17 * 73); g = 0; b = Math.floor(255 - (t - 0.83) / 0.17 * 25); } // indigo-violet
        return `rgb(${r},${g},${b})`;
    }

    function drawEMSpectrum() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const logFreq = +document.getElementById("emfreq").value;
        const showPhoton = document.getElementById("showPhoton").checked;

        // Spectrum bar
        const barY = 40, barH = 60;
        const bands = [
            { name: "Radio",       min: 4,    max: 9,    color: "#b71c1c" },
            { name: "Microwave",   min: 9,    max: 11.5, color: "#e65100" },
            { name: "Infrared",    min: 11.5, max: 14.0, color: "#ff6f00" },
            { name: "Visible",     min: 14.0, max: 14.85,color: null },
            { name: "Ultraviolet", min: 14.85,max: 16.5, color: "#7b1fa2" },
            { name: "X-ray",       min: 16.5, max: 19,   color: "#1565c0" },
            { name: "Gamma",       min: 19,   max: 20,   color: "#004d40" }
        ];

        const totalRange = 20 - 4;
        bands.forEach(band => {
            const x1 = ((band.min - 4) / totalRange) * W;
            const x2 = ((band.max - 4) / totalRange) * W;

            if (band.name === "Visible") {
                // Draw rainbow gradient
                for (let px = Math.floor(x1); px < Math.ceil(x2); px++) {
                    const f = 14.0 + ((px - x1) / (x2 - x1)) * 0.85;
                    const col = freqToColor(f);
                    if (col) {
                        ctx.fillStyle = col;
                        ctx.fillRect(px, barY, 1, barH);
                    }
                }
            } else {
                ctx.fillStyle = band.color;
                ctx.fillRect(x1, barY, x2 - x1, barH);
            }

            // Label
            ctx.fillStyle = "#ddd";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(band.name, (x1 + x2) / 2, barY + barH + 14);
        });

        // Frequency indicator
        const indX = ((logFreq - 4) / totalRange) * W;
        ctx.beginPath();
        ctx.moveTo(indX, barY - 8);
        ctx.lineTo(indX - 6, barY - 20);
        ctx.lineTo(indX + 6, barY - 20);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(indX, barY);
        ctx.lineTo(indX, barY + barH);
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = "12px sans-serif";
        ctx.fillText(`10^${logFreq.toFixed(1)} Hz`, indX, barY - 24);

        // Determine which band we're in
        let currentBand = "Unknown";
        for (const b of bands) {
            if (logFreq >= b.min && logFreq < b.max) { currentBand = b.name; break; }
        }

        // Wave visualization
        const waveY = 220;
        const displayFreq = Math.pow(10, (logFreq - 4) * 0.15) * 0.5;
        const displayWavelength = Math.max(4, 200 / displayFreq);

        // Draw wave
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
            const y = waveY + 50 * Math.sin((x / displayWavelength) * Math.PI * 2 - emState.t * 0.08 * displayFreq);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const waveColor = freqToColor(logFreq) || (logFreq < 14 ? "#ff6f00" : "#7b1fa2");
        ctx.strokeStyle = waveColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // E and B field labels
        ctx.fillStyle = waveColor;
        ctx.font = "13px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("E field", 14, waveY - 55);

        // B field (perpendicular, shown as dashed)
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
            const y = waveY + 30 * Math.cos((x / displayWavelength) * Math.PI * 2 - emState.t * 0.08 * displayFreq);
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(150,150,200,0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(150,150,200,0.6)";
        ctx.fillText("B field", 14, waveY + 45);

        // Photon animation
        if (showPhoton) {
            const photonX = (emState.t * 2 * Math.min(displayFreq, 5)) % W;
            const photonY = waveY + 50 * Math.sin((photonX / displayWavelength) * Math.PI * 2 - emState.t * 0.08 * displayFreq);
            const pgr = ctx.createRadialGradient(photonX, photonY, 2, photonX, photonY, 12);
            pgr.addColorStop(0, "#ffffff");
            pgr.addColorStop(0.5, waveColor);
            pgr.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(photonX, photonY, 12, 0, Math.PI * 2);
            ctx.fillStyle = pgr;
            ctx.fill();
        }

        // Info panel at bottom
        const freq = Math.pow(10, logFreq);
        const c = 3e8;
        const wl = c / freq;
        const energy = 6.626e-34 * freq;

        let wlStr;
        if (wl > 1) wlStr = wl.toFixed(1) + " m";
        else if (wl > 1e-3) wlStr = (wl * 1e3).toFixed(1) + " mm";
        else if (wl > 1e-6) wlStr = (wl * 1e6).toFixed(2) + " \u00b5m";
        else if (wl > 1e-9) wlStr = (wl * 1e9).toFixed(1) + " nm";
        else wlStr = (wl * 1e12).toFixed(2) + " pm";

        // Properties box
        const boxY = 340;
        ctx.fillStyle = "rgba(16, 20, 58, 0.9)";
        ctx.fillRect(40, boxY, W - 80, 140);
        ctx.strokeStyle = "#2a2f6e";
        ctx.lineWidth = 1;
        ctx.strokeRect(40, boxY, W - 80, 140);

        ctx.font = "13px sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#00d4ff";
        ctx.fillText(`Band: ${currentBand}`, 60, boxY + 24);
        ctx.fillStyle = "#ccc";
        ctx.fillText(`Frequency: ${freq.toExponential(2)} Hz`, 60, boxY + 48);
        ctx.fillText(`Wavelength: ${wlStr}`, 60, boxY + 72);
        ctx.fillText(`Photon Energy: ${energy.toExponential(2)} J  (${(energy / 1.602e-19).toExponential(2)} eV)`, 60, boxY + 96);

        // Real-world use
        const uses = {
            "Radio": "AM/FM radio, TV broadcasting, communication",
            "Microwave": "Microwave ovens, radar, WiFi, cell phones",
            "Infrared": "Thermal imaging, remote controls, heating",
            "Visible": "Human vision, optical fibers, photography",
            "Ultraviolet": "Sterilization, fluorescence, sunburn",
            "X-ray": "Medical imaging, security scanning, crystallography",
            "Gamma": "Cancer treatment, nuclear physics, sterilization"
        };
        ctx.fillStyle = "#888";
        ctx.font = "11px sans-serif";
        ctx.fillText(`Uses: ${uses[currentBand] || "N/A"}`, 60, boxY + 124);

        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:${waveColor}">EM Spectrum</b><br>` +
            `Band: ${currentBand}<br>` +
            `\u03bb: ${wlStr}<br>` +
            `f: 10^${logFreq.toFixed(1)} Hz`;

        if (emState.running) {
            emState.t++;
            animId = requestAnimationFrame(drawEMSpectrum);
        }
    }

    bindSlider("emfreq", "val-emfreq", () => { /* live update */ });
    document.getElementById("showPhoton").addEventListener("change", () => {});
    document.getElementById("btn-em-reset").addEventListener("click", initEMSpectrum);

    // ═══════════════════════════════════════════════════════
    // 11. LENS OPTICS (RAY TRACING)
    // ═══════════════════════════════════════════════════════

    function initLens() {
        drawLens();
    }

    function drawLens() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const f = +document.getElementById("focal").value;
        const objDist = +document.getElementById("objDist").value;
        const objH = +document.getElementById("objHeight").value;
        const lensType = document.getElementById("lensType").value;
        const fSign = lensType === "convex" ? f : -f;

        const lensX = W / 2;
        const axisY = H / 2 + 20;

        // Optical axis
        ctx.beginPath();
        ctx.moveTo(0, axisY);
        ctx.lineTo(W, axisY);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Lens
        ctx.beginPath();
        if (lensType === "convex") {
            ctx.ellipse(lensX, axisY, 8, 180, 0, 0, Math.PI * 2);
        } else {
            ctx.moveTo(lensX, axisY - 180);
            ctx.bezierCurveTo(lensX + 15, axisY - 90, lensX + 15, axisY + 90, lensX, axisY + 180);
            ctx.bezierCurveTo(lensX + 5, axisY + 90, lensX + 5, axisY - 90, lensX, axisY - 180);
        }
        ctx.fillStyle = "rgba(100, 180, 255, 0.2)";
        ctx.fill();
        ctx.strokeStyle = "#64b5f6";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Focal points
        ctx.fillStyle = "#ffeb3b";
        ctx.beginPath(); ctx.arc(lensX - Math.abs(fSign), axisY, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(lensX + Math.abs(fSign), axisY, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#aab";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("F", lensX - Math.abs(fSign), axisY + 16);
        ctx.fillText("F'", lensX + Math.abs(fSign), axisY + 16);

        // Object (arrow on left)
        const objX = lensX - objDist;
        ctx.strokeStyle = "#66bb6a";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(objX, axisY);
        ctx.lineTo(objX, axisY - objH);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(objX, axisY - objH);
        ctx.lineTo(objX - 6, axisY - objH + 10);
        ctx.lineTo(objX + 6, axisY - objH + 10);
        ctx.closePath();
        ctx.fillStyle = "#66bb6a";
        ctx.fill();
        ctx.font = "11px sans-serif";
        ctx.fillText("Object", objX, axisY + 20);

        // Thin lens formula: 1/v = 1/f - 1/u  (using sign convention)
        const imgDist = 1 / (1 / fSign + 1 / objDist);
        const magnification = imgDist / objDist;
        const imgH = -magnification * objH;
        const imgX = lensX + imgDist;

        // Image (arrow)
        const isVirtual = (lensType === "convex" && objDist < f) || lensType === "concave";
        const imgColor = isVirtual ? "rgba(239, 83, 80, 0.5)" : "#ef5350";

        if (isVirtual) {
            ctx.setLineDash([6, 4]);
        }
        ctx.strokeStyle = imgColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(imgX, axisY);
        ctx.lineTo(imgX, axisY - imgH);
        ctx.stroke();
        ctx.setLineDash([]);
        // Arrowhead
        ctx.beginPath();
        const aDir = imgH > 0 ? 10 : -10;
        ctx.moveTo(imgX, axisY - imgH);
        ctx.lineTo(imgX - 6, axisY - imgH + aDir);
        ctx.lineTo(imgX + 6, axisY - imgH + aDir);
        ctx.closePath();
        ctx.fillStyle = imgColor;
        ctx.fill();
        ctx.fillStyle = "#ef5350";
        ctx.fillText(isVirtual ? "Virtual Image" : "Real Image", imgX, axisY + 20);

        // Ray 1: parallel to axis → through focal point
        ctx.strokeStyle = "rgba(255, 235, 59, 0.6)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(objX, axisY - objH);
        ctx.lineTo(lensX, axisY - objH);
        if (lensType === "convex") {
            ctx.lineTo(lensX + 400, axisY + (objH / fSign) * 400);
        } else {
            ctx.lineTo(lensX + 400, axisY - objH + (objH / Math.abs(fSign)) * 400);
        }
        ctx.stroke();

        // Ray 2: through center of lens (undeviated)
        ctx.strokeStyle = "rgba(0, 212, 255, 0.6)";
        ctx.beginPath();
        ctx.moveTo(objX, axisY - objH);
        const slope = -objH / (-objDist);
        ctx.lineTo(lensX + 400, axisY - objH + slope * (objDist + 400));
        ctx.stroke();

        // Ray 3: through focal point → parallel
        ctx.strokeStyle = "rgba(171, 71, 188, 0.6)";
        ctx.beginPath();
        ctx.moveTo(objX, axisY - objH);
        if (lensType === "convex") {
            const focalX = lensX - f;
            const slopeF = (axisY - objH - axisY) / (objX - focalX);
            const yAtLens = axisY + slopeF * (lensX - focalX);
            ctx.lineTo(lensX, yAtLens);
            ctx.lineTo(lensX + 400, yAtLens);
        } else {
            const focalX = lensX + f;
            const slopeF = ((axisY) - (axisY - objH)) / (focalX - objX);
            const yAtLens = axisY - objH + slopeF * (lensX - objX);
            ctx.lineTo(lensX, yAtLens);
            ctx.lineTo(lensX + 400, yAtLens);
        }
        ctx.stroke();

        // Virtual ray extensions (dashed)
        if (isVirtual) {
            ctx.setLineDash([4, 4]);
            ctx.strokeStyle = "rgba(239, 83, 80, 0.3)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(lensX, axisY - objH);
            ctx.lineTo(imgX, axisY - imgH);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Legend
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "rgba(255,235,59,0.7)"; ctx.fillText("── Parallel ray", 14, 20);
        ctx.fillStyle = "rgba(0,212,255,0.7)"; ctx.fillText("── Central ray", 14, 36);
        ctx.fillStyle = "rgba(171,71,188,0.7)"; ctx.fillText("── Focal ray", 14, 52);
        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:#64b5f6">Lens Optics</b><br>` +
            `Type: ${lensType}<br>` +
            `f: ${f} px<br>` +
            `u: ${objDist} px<br>` +
            `v: ${imgDist.toFixed(0)} px<br>` +
            `M: ${magnification.toFixed(2)}x<br>` +
            `${isVirtual ? "Virtual" : "Real"}, ${magnification < 0 ? "Inverted" : "Upright"}`;
    }

    bindSlider("focal", "val-focal", () => { if (currentSim === "lens") drawLens(); });
    bindSlider("objDist", "val-objDist", () => { if (currentSim === "lens") drawLens(); });
    bindSlider("objHeight", "val-objHeight", () => { if (currentSim === "lens") drawLens(); });
    document.getElementById("lensType").addEventListener("change", () => { if (currentSim === "lens") drawLens(); });
    document.getElementById("btn-lens-reset").addEventListener("click", () => {
        document.getElementById("focal").value = 120;
        document.getElementById("val-focal").textContent = "120";
        document.getElementById("objDist").value = 250;
        document.getElementById("val-objDist").textContent = "250";
        document.getElementById("objHeight").value = 80;
        document.getElementById("val-objHeight").textContent = "80";
        drawLens();
    });

    // ═══════════════════════════════════════════════════════
    // 12. N-BODY GRAVITATIONAL SIMULATION
    // ═══════════════════════════════════════════════════════
    let nbBodies = [];

    function initNBody() {
        // Default: binary star
        setupBinary();
        drawNBody();
    }

    function setupBinary() {
        const cx = canvas.width / 2, cy = canvas.height / 2;
        nbBodies = [
            { x: cx - 80, y: cy, vx: 0, vy: -1.2, mass: 500, r: 14, color: "#fff176", trail: [] },
            { x: cx + 80, y: cy, vx: 0, vy: 1.2, mass: 500, r: 14, color: "#ff8a65", trail: [] }
        ];
    }

    function setupTriple() {
        const cx = canvas.width / 2, cy = canvas.height / 2;
        const R = 120;
        nbBodies = [];
        for (let i = 0; i < 3; i++) {
            const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
            const vAngle = angle + Math.PI / 2;
            const colors = ["#ff5252", "#69f0ae", "#448aff"];
            nbBodies.push({
                x: cx + R * Math.cos(angle),
                y: cy + R * Math.sin(angle),
                vx: 0.9 * Math.cos(vAngle),
                vy: 0.9 * Math.sin(vAngle),
                mass: 400, r: 12,
                color: colors[i],
                trail: []
            });
        }
    }

    function setupCluster() {
        const cx = canvas.width / 2, cy = canvas.height / 2;
        nbBodies = [
            { x: cx, y: cy, vx: 0, vy: 0, mass: 2000, r: 20, color: "#fff176", trail: [] }
        ];
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const dist = 100 + Math.random() * 100;
            const speed = Math.sqrt(2000 / dist) * 0.6;
            const vAngle = angle + Math.PI / 2;
            const hue = (i / 8) * 360;
            nbBodies.push({
                x: cx + dist * Math.cos(angle),
                y: cy + dist * Math.sin(angle),
                vx: speed * Math.cos(vAngle),
                vy: speed * Math.sin(vAngle),
                mass: 5 + Math.random() * 15,
                r: 4 + Math.random() * 3,
                color: `hsl(${hue}, 70%, 65%)`,
                trail: []
            });
        }
    }

    function drawNBody() {
        const W = canvas.width, H = canvas.height;
        const dt = +document.getElementById("nbStep").value;
        const showTrails = document.getElementById("nbTrails").checked;
        ctx.clearRect(0, 0, W, H);

        // Starfield
        for (let i = 0; i < 80; i++) {
            const sx = ((i * 7919 + 17) % W);
            const sy = ((i * 6271 + 17) % H);
            ctx.beginPath();
            ctx.arc(sx, sy, 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.15 + (i % 4) * 0.1})`;
            ctx.fill();
        }

        const G = 0.5;

        // Compute forces
        for (let i = 0; i < nbBodies.length; i++) {
            let fx = 0, fy = 0;
            for (let j = 0; j < nbBodies.length; j++) {
                if (i === j) continue;
                const dx = nbBodies[j].x - nbBodies[i].x;
                const dy = nbBodies[j].y - nbBodies[i].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 10) continue;
                const force = G * nbBodies[i].mass * nbBodies[j].mass / (dist * dist);
                fx += force * dx / dist;
                fy += force * dy / dist;
            }
            nbBodies[i].vx += (fx / nbBodies[i].mass) * dt;
            nbBodies[i].vy += (fy / nbBodies[i].mass) * dt;
        }

        // Update positions and trails
        nbBodies.forEach(b => {
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.trail.push({ x: b.x, y: b.y });
            if (b.trail.length > 400) b.trail.shift();
        });

        // Draw trails
        if (showTrails) {
            nbBodies.forEach(b => {
                if (b.trail.length < 2) return;
                for (let i = 1; i < b.trail.length; i++) {
                    const alpha = (i / b.trail.length) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(b.trail[i - 1].x, b.trail[i - 1].y);
                    ctx.lineTo(b.trail[i].x, b.trail[i].y);
                    ctx.strokeStyle = b.color.replace(")", `, ${alpha})`).replace("rgb", "rgba").replace("hsl", "hsla");
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        }

        // Draw bodies
        nbBodies.forEach(b => {
            const grad = ctx.createRadialGradient(b.x - 2, b.y - 2, 1, b.x, b.y, b.r + 6);
            grad.addColorStop(0, "#ffffff");
            grad.addColorStop(0.4, b.color);
            grad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r + 6, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
        });

        // Check bounds — recenter if all escaped
        const allOOB = nbBodies.every(b => b.x < -200 || b.x > W + 200 || b.y < -200 || b.y > H + 200);
        if (allOOB) { initNBody(); return; }

        overlay.innerHTML =
            `<b style="color:#fff176">N-Body Gravity</b><br>` +
            `Bodies: ${nbBodies.length}<br>` +
            `dt: ${dt}x`;

        animId = requestAnimationFrame(drawNBody);
    }

    bindSlider("nbStep", "val-nbStep");
    document.getElementById("btn-nb-binary").addEventListener("click", () => {
        cancelAnimationFrame(animId); setupBinary(); drawNBody();
    });
    document.getElementById("btn-nb-triple").addEventListener("click", () => {
        cancelAnimationFrame(animId); setupTriple(); drawNBody();
    });
    document.getElementById("btn-nb-cluster").addEventListener("click", () => {
        cancelAnimationFrame(animId); setupCluster(); drawNBody();
    });
    document.getElementById("btn-nb-reset").addEventListener("click", () => {
        cancelAnimationFrame(animId); initNBody();
    });

    // ═══════════════════════════════════════════════════════
    // 13. RADIOACTIVE DECAY
    // ═══════════════════════════════════════════════════════
    let decayState = {};

    function initDecay() {
        const n = +document.getElementById("atoms").value;
        const cols = Math.ceil(Math.sqrt(n * (canvas.width / canvas.height)));
        const rows = Math.ceil(n / cols);
        decayState = {
            atoms: Array.from({ length: n }, () => ({ decayed: false, decayTime: -1 })),
            cols, rows,
            running: false,
            startTime: 0,
            elapsed: 0,
            history: []
        };
        drawDecay();
    }

    function drawDecay() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const halflife = +document.getElementById("halflife").value;
        const { atoms, cols, rows } = decayState;
        const total = atoms.length;

        // Grid area
        const gridW = W * 0.55;
        const gridH = H - 40;
        const cellW = gridW / cols;
        const cellH = gridH / rows;
        const offsetX = 20;
        const offsetY = 20;

        let remaining = 0;

        // If running, decay atoms probabilistically
        if (decayState.running) {
            decayState.elapsed += 1 / 60;
            const decayProb = 1 - Math.pow(0.5, 1 / (halflife * 60));
            atoms.forEach(a => {
                if (!a.decayed && Math.random() < decayProb) {
                    a.decayed = true;
                    a.decayTime = decayState.elapsed;
                }
            });
        }

        // Draw atoms grid
        atoms.forEach((a, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = offsetX + col * cellW + cellW / 2;
            const y = offsetY + row * cellH + cellH / 2;
            const r = Math.min(cellW, cellH) * 0.35;

            if (a.decayed) {
                // Flash effect on recent decay
                const age = decayState.elapsed - a.decayTime;
                if (age < 0.3) {
                    ctx.beginPath();
                    ctx.arc(x, y, r + 4, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 235, 59, ${0.5 - age * 1.5})`;
                    ctx.fill();
                }
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = "#37474f";
                ctx.fill();
            } else {
                remaining++;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI * 2);
                ctx.fillStyle = "#66bb6a";
                ctx.fill();
            }
        });

        // Record history
        if (decayState.running) {
            decayState.history.push({ t: decayState.elapsed, n: remaining });
        }

        // Decay curve graph
        const graphX = W * 0.6;
        const graphW2 = W * 0.35;
        const graphY = 30;
        const graphH2 = H - 60;

        ctx.fillStyle = "rgba(16, 20, 58, 0.8)";
        ctx.fillRect(graphX, graphY, graphW2, graphH2);
        ctx.strokeStyle = "#2a2f6e";
        ctx.lineWidth = 1;
        ctx.strokeRect(graphX, graphY, graphW2, graphH2);

        // Axes labels
        ctx.fillStyle = "#aab";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Time (s)", graphX + graphW2 / 2, graphY + graphH2 + 16);
        ctx.save();
        ctx.translate(graphX - 8, graphY + graphH2 / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Atoms Remaining", 0, 0);
        ctx.restore();
        ctx.textAlign = "start";

        // Theoretical curve
        const maxT = Math.max(halflife * 5, decayState.elapsed + 1);
        ctx.beginPath();
        for (let px = 0; px < graphW2; px++) {
            const t = (px / graphW2) * maxT;
            const n = total * Math.pow(0.5, t / halflife);
            const y = graphY + graphH2 - (n / total) * graphH2;
            px === 0 ? ctx.moveTo(graphX + px, y) : ctx.lineTo(graphX + px, y);
        }
        ctx.strokeStyle = "rgba(255, 152, 0, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Actual data
        if (decayState.history.length > 1) {
            ctx.beginPath();
            decayState.history.forEach((h, i) => {
                const px = graphX + (h.t / maxT) * graphW2;
                const py = graphY + graphH2 - (h.n / total) * graphH2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#66bb6a";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Half-life marker
        const hlX = graphX + (halflife / maxT) * graphW2;
        ctx.beginPath();
        ctx.moveTo(hlX, graphY);
        ctx.lineTo(hlX, graphY + graphH2);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#888";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("t\u00BD", hlX, graphY - 4);
        ctx.textAlign = "start";

        // Legend
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "rgba(255,152,0,0.7)"; ctx.fillText("-- Theory", graphX + 8, graphY + 16);
        ctx.fillStyle = "#66bb6a"; ctx.fillText("── Actual", graphX + 8, graphY + 30);

        overlay.innerHTML =
            `<b style="color:#66bb6a">Radioactive Decay</b><br>` +
            `Remaining: ${remaining}/${total}<br>` +
            `Decayed: ${total - remaining}<br>` +
            `t: ${decayState.elapsed.toFixed(1)} s<br>` +
            `t\u00BD: ${halflife} s`;

        document.getElementById("decay-stats").innerHTML =
            `Remaining: <b>${remaining}</b> / ${total} (${(remaining / total * 100).toFixed(1)}%)`;

        if (decayState.running && remaining > 0) {
            animId = requestAnimationFrame(drawDecay);
        } else if (remaining === 0 && decayState.running) {
            decayState.running = false;
        }
    }

    bindSlider("halflife", "val-halflife");
    bindSlider("atoms", "val-atoms", () => initDecay());
    document.getElementById("btn-decay-start").addEventListener("click", () => {
        if (!decayState.running) {
            decayState.running = true;
            decayState.elapsed = 0;
            decayState.history = [];
            decayState.atoms.forEach(a => { a.decayed = false; a.decayTime = -1; });
            drawDecay();
        }
    });
    document.getElementById("btn-decay-reset").addEventListener("click", initDecay);

    // ═══════════════════════════════════════════════════════
    // 14. THERMODYNAMICS (HEAT TRANSFER)
    // ═══════════════════════════════════════════════════════
    let thermoState = {};

    function initThermo() {
        thermoState = {
            tA: +document.getElementById("tempA").value,
            tB: +document.getElementById("tempB").value,
            running: false,
            history: [],
            time: 0
        };
        drawThermo();
    }

    function tempToColor(t) {
        // Blue (cold) → Red (hot)
        const norm = Math.max(0, Math.min(1, (t - 100) / 1100));
        const r = Math.floor(norm * 255);
        const b = Math.floor((1 - norm) * 255);
        const g = Math.floor(norm < 0.5 ? norm * 2 * 100 : (1 - norm) * 2 * 100);
        return `rgb(${r},${g},${b})`;
    }

    function drawThermo() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const conductivity = +document.getElementById("conduct").value;

        if (thermoState.running) {
            const dQ = conductivity * (thermoState.tA - thermoState.tB);
            thermoState.tA -= dQ;
            thermoState.tB += dQ;
            thermoState.time += 1 / 60;
            thermoState.history.push({ t: thermoState.time, a: thermoState.tA, b: thermoState.tB });
            if (thermoState.history.length > 600) thermoState.history.shift();
        }

        const { tA, tB } = thermoState;

        // Body A (left)
        const boxW = 160, boxH = 200;
        const aX = 100, aY = 80;
        const bX = W - 100 - boxW, bY = 80;

        // Body A
        ctx.fillStyle = tempToColor(tA);
        ctx.fillRect(aX, aY, boxW, boxH);
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 2;
        ctx.strokeRect(aX, aY, boxW, boxH);

        // Body B
        ctx.fillStyle = tempToColor(tB);
        ctx.fillRect(bX, bY, boxW, boxH);
        ctx.strokeRect(bX, bY, boxW, boxH);

        // Labels
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${tA.toFixed(0)} K`, aX + boxW / 2, aY + boxH / 2 + 8);
        ctx.fillText(`${tB.toFixed(0)} K`, bX + boxW / 2, bY + boxH / 2 + 8);
        ctx.font = "13px sans-serif";
        ctx.fillText("Body A (Hot)", aX + boxW / 2, aY - 10);
        ctx.fillText("Body B (Cold)", bX + boxW / 2, bY - 10);

        // Heat flow arrow
        const arrowY = aY + boxH / 2;
        const arrowX1 = aX + boxW + 10;
        const arrowX2 = bX - 10;
        const dT = Math.abs(tA - tB);

        if (dT > 1) {
            const arrowMid = (arrowX1 + arrowX2) / 2;
            const flowDir = tA > tB ? 1 : -1;

            // Animated heat particles
            if (thermoState.running) {
                for (let i = 0; i < 8; i++) {
                    const phase = (thermoState.time * 3 + i * 0.4) % 1;
                    const px = arrowX1 + phase * (arrowX2 - arrowX1) * flowDir;
                    const py = arrowY + Math.sin(phase * Math.PI * 4 + i) * 15;
                    const alpha = Math.sin(phase * Math.PI) * 0.7;
                    ctx.beginPath();
                    ctx.arc(flowDir > 0 ? px : arrowX2 - (px - arrowX1), py, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 152, 0, ${alpha})`;
                    ctx.fill();
                }
            }

            // Arrow
            ctx.beginPath();
            ctx.moveTo(flowDir > 0 ? arrowX1 : arrowX2, arrowY);
            ctx.lineTo(flowDir > 0 ? arrowX2 : arrowX1, arrowY);
            ctx.strokeStyle = "#ff9800";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Arrowhead
            const tipX = flowDir > 0 ? arrowX2 : arrowX1;
            ctx.beginPath();
            ctx.moveTo(tipX, arrowY);
            ctx.lineTo(tipX - flowDir * 10, arrowY - 6);
            ctx.lineTo(tipX - flowDir * 10, arrowY + 6);
            ctx.closePath();
            ctx.fillStyle = "#ff9800";
            ctx.fill();

            ctx.fillStyle = "#ff9800";
            ctx.font = "12px sans-serif";
            ctx.fillText("Q = " + (conductivity * dT).toFixed(1), arrowMid, arrowY - 20);
        } else {
            ctx.fillStyle = "#4caf50";
            ctx.font = "bold 14px sans-serif";
            ctx.fillText("Thermal Equilibrium!", (aX + boxW + bX) / 2, arrowY);
            if (thermoState.running) thermoState.running = false;
        }

        // Temperature graph
        const graphX = 60, graphY2 = 340, graphW2 = W - 120, graphH2 = 140;
        ctx.fillStyle = "rgba(16, 20, 58, 0.8)";
        ctx.fillRect(graphX, graphY2, graphW2, graphH2);
        ctx.strokeStyle = "#2a2f6e";
        ctx.lineWidth = 1;
        ctx.strokeRect(graphX, graphY2, graphW2, graphH2);

        ctx.fillStyle = "#aab";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Temperature vs Time", graphX + 8, graphY2 - 6);

        // Scale markers
        ctx.fillStyle = "#556";
        ctx.font = "9px sans-serif";
        ctx.textAlign = "right";
        ctx.fillText("1200K", graphX - 4, graphY2 + 10);
        ctx.fillText("100K", graphX - 4, graphY2 + graphH2);

        if (thermoState.history.length > 1) {
            const maxT = thermoState.history[thermoState.history.length - 1].t;
            // Body A line
            ctx.beginPath();
            thermoState.history.forEach((h, i) => {
                const px = graphX + (h.t / maxT) * graphW2;
                const py = graphY2 + graphH2 - ((h.a - 100) / 1100) * graphH2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#ef5350";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Body B line
            ctx.beginPath();
            thermoState.history.forEach((h, i) => {
                const px = graphX + (h.t / maxT) * graphW2;
                const py = graphY2 + graphH2 - ((h.b - 100) / 1100) * graphH2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#42a5f5";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Equilibrium line
            const eq = (thermoState.history[0].a + thermoState.history[0].b) / 2;
            const eqY = graphY2 + graphH2 - ((eq - 100) / 1100) * graphH2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(graphX, eqY);
            ctx.lineTo(graphX + graphW2, eqY);
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.textAlign = "start";
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "#ef5350"; ctx.fillText("Body A", graphX + graphW2 - 90, graphY2 + 16);
        ctx.fillStyle = "#42a5f5"; ctx.fillText("Body B", graphX + graphW2 - 90, graphY2 + 30);

        overlay.innerHTML =
            `<b style="color:#ff9800">Heat Transfer</b><br>` +
            `A: ${tA.toFixed(0)} K<br>` +
            `B: ${tB.toFixed(0)} K<br>` +
            `\u0394T: ${dT.toFixed(0)} K<br>` +
            `t: ${thermoState.time.toFixed(1)} s`;

        if (thermoState.running) {
            animId = requestAnimationFrame(drawThermo);
        }
    }

    bindSlider("tempA", "val-tempA", v => { if (!thermoState.running) { thermoState.tA = v; drawThermo(); } });
    bindSlider("tempB", "val-tempB", v => { if (!thermoState.running) { thermoState.tB = v; drawThermo(); } });
    bindSlider("conduct", "val-conduct");

    document.getElementById("btn-thermo-start").addEventListener("click", () => {
        if (!thermoState.running) {
            thermoState.running = true;
            thermoState.time = 0;
            thermoState.history = [];
            thermoState.tA = +document.getElementById("tempA").value;
            thermoState.tB = +document.getElementById("tempB").value;
            drawThermo();
        }
    });
    document.getElementById("btn-thermo-reset").addEventListener("click", initThermo);

    // ── Start default simulation ────────────────────────────
    initProjectile();
})();
