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
        currentSim = name;
        overlay.textContent = "";
        switch (name) {
            case "projectile": initProjectile(); break;
            case "pendulum":   initPendulum();   break;
            case "wave":       initWave();        break;
            case "gas":        initGas();         break;
            case "orbit":      initOrbit();       break;
        }
    }

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

    // ── Start default simulation ────────────────────────────
    initProjectile();
})();
