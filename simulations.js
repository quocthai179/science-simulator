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
            case "doppler":     initDoppler();      break;
            case "incline":     initIncline();      break;
            case "circuit":     initCircuit();      break;
            case "diffusion":   initDiffusion();    break;
            case "pendwave":    initPendWave();     break;
            case "buoyancy":    initBuoyancy();     break;
            case "coulomb":     initCoulomb();      break;
            case "lissajous":   initLissajous();    break;
            case "blackbody":   initBlackbody();    break;
            case "collision":   initCollision();    break;
            case "mitosis":     initMitosis();      break;
            case "predprey":    initPredPrey();     break;
            case "selection":   initSelection();    break;
            case "neuron":      initNeuron();       break;
            case "enzyme":      initEnzyme();       break;
            case "dna":         initDNA();          break;
            case "photosyn":    initPhotosyn();     break;
            case "hardywein":   initHardyWein();    break;
            case "foodweb":     initFoodWeb();      break;
            case "membrane":    initMembrane();     break;
            case "respiration": initRespiration();  break;
            case "magfield":    initMagField();     break;
            case "chemeq":      initChemEq();       break;
            case "epidemic":    initEpidemic();     break;
            case "bernoulli":   initBernoulli();    break;
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

    // ═══════════════════════════════════════════════════════
    // 15. DOPPLER EFFECT
    // ═══════════════════════════════════════════════════════
    let dopplerState = {};

    function initDoppler() {
        dopplerState = { t: 0, running: true, waves: [], srcX: 100 };
        document.getElementById("btn-doppler-toggle").textContent = "Pause";
        drawDoppler();
    }

    function drawDoppler() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const srcSpd = +document.getElementById("srcSpeed").value;
        const waveSpd = +document.getElementById("waveSpeed").value;
        const emitRate = +document.getElementById("emitRate").value;
        const srcY = H / 2;

        if (dopplerState.running) {
            dopplerState.t++;
            dopplerState.srcX += srcSpd;
            if (dopplerState.srcX > W + 50) dopplerState.srcX = -50;

            // Emit new wave
            if (dopplerState.t % Math.max(1, Math.round(60 / emitRate)) === 0) {
                dopplerState.waves.push({ x: dopplerState.srcX, y: srcY, r: 0 });
            }

            // Expand waves
            dopplerState.waves.forEach(w => { w.r += waveSpd; });
            dopplerState.waves = dopplerState.waves.filter(w => w.r < W);
        }

        // Draw waves
        dopplerState.waves.forEach(w => {
            const alpha = Math.max(0.05, 0.4 - w.r / W);
            ctx.beginPath();
            ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });

        // Source
        const grad = ctx.createRadialGradient(dopplerState.srcX, srcY, 3, dopplerState.srcX, srcY, 16);
        grad.addColorStop(0, "#ff6ec7");
        grad.addColorStop(1, "rgba(255,110,199,0.1)");
        ctx.beginPath();
        ctx.arc(dopplerState.srcX, srcY, 16, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dopplerState.srcX, srcY, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#ff6ec7";
        ctx.fill();

        // Velocity arrow
        if (srcSpd > 0) {
            ctx.beginPath();
            ctx.moveTo(dopplerState.srcX + 20, srcY);
            ctx.lineTo(dopplerState.srcX + 20 + srcSpd * 12, srcY);
            ctx.strokeStyle = "#ffeb3b";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(dopplerState.srcX + 20 + srcSpd * 12, srcY);
            ctx.lineTo(dopplerState.srcX + 12 + srcSpd * 12, srcY - 5);
            ctx.lineTo(dopplerState.srcX + 12 + srcSpd * 12, srcY + 5);
            ctx.closePath();
            ctx.fillStyle = "#ffeb3b";
            ctx.fill();
        }

        // Observer markers
        const obs1X = 100, obs2X = W - 100;
        [obs1X, obs2X].forEach((ox, idx) => {
            ctx.beginPath();
            ctx.arc(ox, H - 60, 10, 0, Math.PI * 2);
            ctx.fillStyle = "#4caf50";
            ctx.fill();
            ctx.fillStyle = "#aab";
            ctx.font = "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(idx === 0 ? "Observer A" : "Observer B", ox, H - 40);
        });

        // Frequency info
        const mach = srcSpd / waveSpd;
        const fApproach = mach < 1 ? (1 / (1 - mach)).toFixed(2) : "\u221e";
        const fRecede = (1 / (1 + mach)).toFixed(2);

        // Frequency labels near observers
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#42a5f5";
        ctx.fillText(`f = ${fRecede}f\u2080`, obs1X, H - 80);
        ctx.fillStyle = "#ef5350";
        ctx.fillText(`f = ${fApproach}f\u2080`, obs2X, H - 80);
        ctx.textAlign = "start";

        // Mach indicator
        if (mach >= 1) {
            ctx.fillStyle = "#ff5252";
            ctx.font = "bold 14px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("SUPERSONIC! (Mach " + mach.toFixed(1) + ")", W / 2, 30);
            ctx.textAlign = "start";

            // Shock cone
            if (mach > 1) {
                const halfAngle = Math.asin(1 / mach);
                ctx.beginPath();
                ctx.moveTo(dopplerState.srcX, srcY);
                ctx.lineTo(dopplerState.srcX - 300, srcY - 300 * Math.tan(halfAngle));
                ctx.moveTo(dopplerState.srcX, srcY);
                ctx.lineTo(dopplerState.srcX - 300, srcY + 300 * Math.tan(halfAngle));
                ctx.strokeStyle = "rgba(255, 82, 82, 0.4)";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        overlay.innerHTML =
            `<b style="color:#ff6ec7">Doppler Effect</b><br>` +
            `Source speed: ${srcSpd.toFixed(1)}<br>` +
            `Wave speed: ${waveSpd.toFixed(1)}<br>` +
            `Mach: ${mach.toFixed(2)}<br>` +
            `Waves: ${dopplerState.waves.length}`;

        if (dopplerState.running) {
            animId = requestAnimationFrame(drawDoppler);
        }
    }

    bindSlider("srcSpeed", "val-srcSpeed");
    bindSlider("waveSpeed", "val-waveSpeed");
    bindSlider("emitRate", "val-emitRate");

    document.getElementById("btn-doppler-toggle").addEventListener("click", () => {
        dopplerState.running = !dopplerState.running;
        document.getElementById("btn-doppler-toggle").textContent = dopplerState.running ? "Pause" : "Resume";
        if (dopplerState.running) drawDoppler();
    });
    document.getElementById("btn-doppler-reset").addEventListener("click", initDoppler);

    // ═══════════════════════════════════════════════════════
    // 16. INCLINED PLANE
    // ═══════════════════════════════════════════════════════
    let incState = {};

    function initIncline() {
        incState = { pos: 0, vel: 0, running: false };
        drawIncline();
    }

    function drawIncline() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const angleDeg = +document.getElementById("incAngle").value;
        const mass = +document.getElementById("incMass").value;
        const mu = +document.getElementById("friction").value;
        const angle = angleDeg * Math.PI / 180;
        const g = 9.8;

        // Ramp geometry
        const rampLen = 500;
        const baseX = 120, baseY = H - 80;
        const topX = baseX + rampLen * Math.cos(angle);
        const topY = baseY - rampLen * Math.sin(angle);

        // Draw ground
        ctx.fillStyle = "#1a2a1a";
        ctx.fillRect(0, baseY, W, H - baseY);

        // Draw ramp
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.lineTo(topX, topY);
        ctx.lineTo(topX, baseY);
        ctx.closePath();
        ctx.fillStyle = "#263238";
        ctx.fill();
        ctx.strokeStyle = "#546e7a";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Angle arc
        ctx.beginPath();
        ctx.arc(baseX, baseY, 50, -angle, 0);
        ctx.strokeStyle = "#ffeb3b";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "#ffeb3b";
        ctx.font = "13px sans-serif";
        ctx.fillText(`${angleDeg}\u00b0`, baseX + 55, baseY - 8);

        // Physics
        if (incState.running) {
            const gParallel = g * Math.sin(angle);
            const gNormal = g * Math.cos(angle);
            const frictionForce = mu * mass * gNormal;
            const netAccel = gParallel - frictionForce / mass;

            if (netAccel > 0 || incState.vel > 0) {
                incState.vel += netAccel * 0.016;
                if (incState.vel < 0) incState.vel = 0;
                incState.pos += incState.vel * 0.016 * 60;
            }
            if (incState.pos > rampLen - 30) {
                incState.pos = rampLen - 30;
                incState.running = false;
            }
        }

        // Block on ramp
        const blockDist = rampLen - 30 - incState.pos;
        const bx = baseX + blockDist * Math.cos(angle);
        const by = baseY - blockDist * Math.sin(angle);
        const blockSize = 24 + mass;

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(-angle);
        // Block
        const bGrad = ctx.createLinearGradient(-blockSize / 2, -blockSize, blockSize / 2, 0);
        bGrad.addColorStop(0, "#42a5f5");
        bGrad.addColorStop(1, "#1565c0");
        ctx.fillStyle = bGrad;
        ctx.fillRect(-blockSize / 2, -blockSize, blockSize, blockSize);
        ctx.strokeStyle = "#90caf9";
        ctx.lineWidth = 1;
        ctx.strokeRect(-blockSize / 2, -blockSize, blockSize, blockSize);

        // Force arrows (in rotated frame)
        const arrowScale = 3;
        const gPar = mass * g * Math.sin(angle);
        const gPerp = mass * g * Math.cos(angle);
        const fFric = mu * mass * g * Math.cos(angle);
        const normal = mass * g * Math.cos(angle);

        // Weight component parallel (down the slope)
        ctx.beginPath();
        ctx.moveTo(0, -blockSize / 2);
        ctx.lineTo(gPar * arrowScale, -blockSize / 2);
        ctx.strokeStyle = "#ef5350";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = "#ef5350";
        ctx.font = "10px sans-serif";
        ctx.fillText("mg sin\u03b8", gPar * arrowScale + 5, -blockSize / 2 + 4);

        // Normal force (perpendicular, up from surface)
        ctx.beginPath();
        ctx.moveTo(0, -blockSize / 2);
        ctx.lineTo(0, -blockSize / 2 - normal * arrowScale);
        ctx.strokeStyle = "#66bb6a";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = "#66bb6a";
        ctx.fillText("N", 5, -blockSize / 2 - normal * arrowScale - 4);

        // Friction (up the slope, opposing motion)
        if (mu > 0) {
            ctx.beginPath();
            ctx.moveTo(0, -blockSize / 2);
            ctx.lineTo(-fFric * arrowScale, -blockSize / 2);
            ctx.strokeStyle = "#ff9800";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.fillStyle = "#ff9800";
            ctx.fillText("f", -fFric * arrowScale - 14, -blockSize / 2 + 4);
        }

        ctx.restore();

        // Weight (straight down)
        ctx.beginPath();
        ctx.moveTo(bx, by - blockSize / 2);
        ctx.lineTo(bx, by - blockSize / 2 + mass * g * arrowScale);
        ctx.strokeStyle = "#ab47bc";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#ab47bc";
        ctx.font = "10px sans-serif";
        ctx.fillText("mg", bx + 5, by - blockSize / 2 + mass * g * arrowScale + 4);

        // Legend
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        const legX = W - 160, legY = 20;
        ctx.fillStyle = "#ef5350"; ctx.fillText("mg sin\u03b8 (parallel)", legX, legY);
        ctx.fillStyle = "#66bb6a"; ctx.fillText("N (normal)", legX, legY + 16);
        ctx.fillStyle = "#ff9800"; ctx.fillText("f (friction)", legX, legY + 32);
        ctx.fillStyle = "#ab47bc"; ctx.fillText("mg (weight)", legX, legY + 48);

        const netForce = mass * g * Math.sin(angle) - fFric;
        overlay.innerHTML =
            `<b style="color:#42a5f5">Inclined Plane</b><br>` +
            `\u03b8: ${angleDeg}\u00b0 | m: ${mass} kg<br>` +
            `\u03bc: ${mu}<br>` +
            `F_net: ${netForce.toFixed(1)} N<br>` +
            `a: ${(netForce / mass).toFixed(2)} m/s\u00b2<br>` +
            `v: ${incState.vel.toFixed(1)} m/s<br>` +
            `${netForce <= 0 ? "Static (no slide)" : ""}`;

        if (incState.running) {
            animId = requestAnimationFrame(drawIncline);
        }
    }

    bindSlider("incAngle", "val-incAngle", () => { if (!incState.running) drawIncline(); });
    bindSlider("incMass", "val-incMass", () => { if (!incState.running) drawIncline(); });
    bindSlider("friction", "val-friction", () => { if (!incState.running) drawIncline(); });

    document.getElementById("btn-inc-release").addEventListener("click", () => {
        incState = { pos: 0, vel: 0, running: true };
        drawIncline();
    });
    document.getElementById("btn-inc-reset").addEventListener("click", initIncline);

    // ═══════════════════════════════════════════════════════
    // 17. RC CIRCUIT
    // ═══════════════════════════════════════════════════════
    let rcState = {};

    function initCircuit() {
        rcState = { charge: 0, mode: "idle", t: 0, history: [] };
        drawCircuit();
    }

    function drawCircuit() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const R = +document.getElementById("resistance").value;
        const C = +document.getElementById("capacitance").value / 1e6; // convert to F
        const V = +document.getElementById("rcVoltage").value;
        const tau = R * C;

        if (rcState.mode === "charging") {
            rcState.t += 1 / 60;
            rcState.charge = V * (1 - Math.exp(-rcState.t / tau));
            rcState.history.push({ t: rcState.t, v: rcState.charge });
        } else if (rcState.mode === "discharging") {
            rcState.t += 1 / 60;
            rcState.charge = rcState.startV * Math.exp(-rcState.t / tau);
            rcState.history.push({ t: rcState.t, v: rcState.charge });
        }

        // Circuit schematic
        const cx = 200, cy = 150;
        // Battery
        ctx.strokeStyle = "#aab";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 80);
        ctx.stroke();
        // Battery symbol
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx - 15, cy + 80); ctx.lineTo(cx + 15, cy + 80); ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(cx - 8, cy + 90); ctx.lineTo(cx + 8, cy + 90); ctx.stroke();
        ctx.fillStyle = "#ffeb3b";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${V}V`, cx - 28, cy + 90);
        ctx.fillText("+", cx + 22, cy + 78);
        ctx.fillText("\u2212", cx + 22, cy + 95);

        // Wire to resistor
        ctx.strokeStyle = "#aab";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 90); ctx.lineTo(cx, cy + 140);
        ctx.lineTo(cx + 60, cy + 140);
        ctx.stroke();

        // Resistor (zigzag)
        ctx.beginPath();
        ctx.moveTo(cx + 60, cy + 140);
        for (let i = 0; i < 6; i++) {
            ctx.lineTo(cx + 70 + i * 15, cy + 140 + (i % 2 === 0 ? -10 : 10));
        }
        ctx.lineTo(cx + 160, cy + 140);
        ctx.strokeStyle = "#ff9800";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#ff9800";
        ctx.fillText(`R = ${R}\u03a9`, cx + 110, cy + 170);

        // Wire to capacitor
        ctx.strokeStyle = "#aab";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + 160, cy + 140);
        ctx.lineTo(cx + 220, cy + 140);
        ctx.stroke();

        // Capacitor plates
        const capX = cx + 220;
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#42a5f5";
        ctx.beginPath(); ctx.moveTo(capX, cy + 120); ctx.lineTo(capX, cy + 160); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(capX + 12, cy + 120); ctx.lineTo(capX + 12, cy + 160); ctx.stroke();

        // Charge indicator between plates
        const chargeLevel = rcState.charge / V;
        const chargeColor = `rgba(66, 165, 245, ${chargeLevel})`;
        ctx.fillStyle = chargeColor;
        ctx.fillRect(capX + 1, cy + 122, 10, 36);

        ctx.fillStyle = "#42a5f5";
        ctx.fillText(`C = ${(C * 1e6).toFixed(0)}\u00b5F`, capX - 10, cy + 180);

        // Wire back to battery
        ctx.strokeStyle = "#aab";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(capX + 12, cy + 140);
        ctx.lineTo(capX + 50, cy + 140);
        ctx.lineTo(capX + 50, cy);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Current flow indicator
        if (rcState.mode !== "idle") {
            const current = rcState.mode === "charging"
                ? (V / R) * Math.exp(-rcState.t / tau)
                : -(rcState.startV / R) * Math.exp(-rcState.t / tau);
            const absCurrent = Math.abs(current);
            if (absCurrent > 0.0001) {
                const numDots = Math.min(6, Math.ceil(absCurrent * R * 2));
                for (let i = 0; i < numDots; i++) {
                    const phase = (rcState.t * 5 + i * 0.3) % 1;
                    // Move along circuit path
                    let dx, dy;
                    if (phase < 0.25) {
                        dx = cx + phase * 4 * 220; dy = cy;
                    } else if (phase < 0.5) {
                        dx = cx + 220; dy = cy + (phase - 0.25) * 4 * 140;
                    } else if (phase < 0.75) {
                        dx = cx + 220 - (phase - 0.5) * 4 * 220; dy = cy + 140;
                    } else {
                        dx = cx; dy = cy + 140 - (phase - 0.75) * 4 * 140;
                    }
                    ctx.beginPath();
                    ctx.arc(dx, dy, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 235, 59, ${0.7})`;
                    ctx.fill();
                }
            }
        }

        // Voltage-time graph
        const graphX = 50, graphY2 = 280, graphW2 = W - 100, graphH2 = 200;
        ctx.fillStyle = "rgba(16, 20, 58, 0.8)";
        ctx.fillRect(graphX, graphY2, graphW2, graphH2);
        ctx.strokeStyle = "#2a2f6e";
        ctx.lineWidth = 1;
        ctx.strokeRect(graphX, graphY2, graphW2, graphH2);

        ctx.fillStyle = "#aab";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Capacitor Voltage vs Time", graphX + 8, graphY2 - 6);

        // Tau markers
        ctx.font = "9px sans-serif";
        ctx.fillStyle = "#556";
        ctx.textAlign = "right";
        ctx.fillText(`${V}V`, graphX - 4, graphY2 + 10);
        ctx.fillText("0V", graphX - 4, graphY2 + graphH2);

        const maxT = Math.max(tau * 5, rcState.t + 0.5);
        // Tau vertical lines
        for (let i = 1; i <= 5; i++) {
            const tauX = graphX + (tau * i / maxT) * graphW2;
            if (tauX < graphX + graphW2) {
                ctx.beginPath();
                ctx.moveTo(tauX, graphY2);
                ctx.lineTo(tauX, graphY2 + graphH2);
                ctx.strokeStyle = "rgba(255,255,255,0.08)";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = "#556";
                ctx.textAlign = "center";
                ctx.fillText(`${i}\u03c4`, tauX, graphY2 + graphH2 + 12);
            }
        }

        // Theoretical curves
        ctx.setLineDash([4, 4]);
        // Charge curve
        ctx.beginPath();
        for (let px = 0; px < graphW2; px++) {
            const t = (px / graphW2) * maxT;
            const v = V * (1 - Math.exp(-t / tau));
            const py = graphY2 + graphH2 - (v / V) * graphH2;
            px === 0 ? ctx.moveTo(graphX + px, py) : ctx.lineTo(graphX + px, py);
        }
        ctx.strokeStyle = "rgba(76, 175, 80, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);

        // Actual data
        if (rcState.history.length > 1) {
            ctx.beginPath();
            rcState.history.forEach((h, i) => {
                const px = graphX + (h.t / maxT) * graphW2;
                const py = graphY2 + graphH2 - (h.v / V) * graphH2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = rcState.mode === "charging" ? "#4caf50" : "#ef5350";
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:#42a5f5">RC Circuit</b><br>` +
            `V_c: ${rcState.charge.toFixed(2)} V<br>` +
            `\u03c4 = RC = ${(tau * 1000).toFixed(0)} ms<br>` +
            `t: ${rcState.t.toFixed(2)} s<br>` +
            `Mode: ${rcState.mode}`;

        if (rcState.mode !== "idle" && rcState.t < tau * 6) {
            animId = requestAnimationFrame(drawCircuit);
        }
    }

    bindSlider("resistance", "val-resistance", () => { if (rcState.mode === "idle") drawCircuit(); });
    bindSlider("capacitance", "val-capacitance", () => { if (rcState.mode === "idle") drawCircuit(); });
    bindSlider("rcVoltage", "val-voltage", () => { if (rcState.mode === "idle") drawCircuit(); });

    document.getElementById("btn-rc-charge").addEventListener("click", () => {
        rcState = { charge: 0, mode: "charging", t: 0, history: [] };
        drawCircuit();
    });
    document.getElementById("btn-rc-discharge").addEventListener("click", () => {
        const V = +document.getElementById("rcVoltage").value;
        rcState = { charge: V, startV: V, mode: "discharging", t: 0, history: [] };
        drawCircuit();
    });
    document.getElementById("btn-rc-reset").addEventListener("click", initCircuit);

    // ═══════════════════════════════════════════════════════
    // 18. PARTICLE DIFFUSION
    // ═══════════════════════════════════════════════════════
    let diffState = {};

    function initDiffusion() {
        const n = +document.getElementById("diffParts").value;
        const W = canvas.width, H = canvas.height;
        const particles = [];
        // All particles start on the left side
        for (let i = 0; i < n; i++) {
            particles.push({
                x: 30 + Math.random() * (W / 2 - 50),
                y: 30 + Math.random() * (H - 60),
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                side: "left"
            });
        }
        diffState = { particles, running: false, t: 0, history: [] };
        drawDiffusion();
    }

    function drawDiffusion() {
        const W = canvas.width, H = canvas.height;
        const perm = +document.getElementById("perm").value;
        ctx.clearRect(0, 0, W, H);

        const wall = 20;
        const midX = W / 2;

        // Container
        ctx.strokeStyle = "#3949ab";
        ctx.lineWidth = 3;
        ctx.strokeRect(wall, wall, W - wall * 2, H - wall * 2);

        // Membrane (dashed line in middle)
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(midX, wall);
        ctx.lineTo(midX, H - wall);
        ctx.strokeStyle = "#7986cb";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#7986cb";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Membrane", midX, wall - 6);

        let leftCount = 0, rightCount = 0;

        if (diffState.running) {
            diffState.t += 1 / 60;
        }

        diffState.particles.forEach(p => {
            if (diffState.running) {
                // Random walk
                p.vx += (Math.random() - 0.5) * 0.5;
                p.vy += (Math.random() - 0.5) * 0.5;
                p.vx *= 0.95;
                p.vy *= 0.95;
                p.x += p.vx;
                p.y += p.vy;

                // Wall bouncing
                if (p.x < wall + 4) { p.x = wall + 4; p.vx *= -1; }
                if (p.x > W - wall - 4) { p.x = W - wall - 4; p.vx *= -1; }
                if (p.y < wall + 4) { p.y = wall + 4; p.vy *= -1; }
                if (p.y > H - wall - 4) { p.y = H - wall - 4; p.vy *= -1; }

                // Membrane crossing (probabilistic)
                if (Math.abs(p.x - midX) < 5) {
                    if (Math.random() > perm) {
                        // Bounce off membrane
                        p.vx *= -1;
                        p.x += p.vx * 2;
                    }
                }
            }

            // Count sides
            if (p.x < midX) leftCount++; else rightCount++;

            // Draw particle
            const hue = p.x < midX ? 200 : 30;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
            ctx.fill();
        });

        // Record history
        if (diffState.running && diffState.t > 0) {
            if (diffState.history.length === 0 || diffState.t - diffState.history[diffState.history.length - 1].t > 0.1) {
                diffState.history.push({ t: diffState.t, left: leftCount, right: rightCount });
            }
        }

        // Concentration graph
        const graphX = 50, graphY2 = H - 140, graphW2 = W - 100, graphH2 = 110;
        ctx.fillStyle = "rgba(16, 20, 58, 0.85)";
        ctx.fillRect(graphX, graphY2, graphW2, graphH2);
        ctx.strokeStyle = "#2a2f6e";
        ctx.lineWidth = 1;
        ctx.strokeRect(graphX, graphY2, graphW2, graphH2);

        ctx.fillStyle = "#aab";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Particle Count vs Time", graphX + 8, graphY2 - 4);

        // Equilibrium line
        const eqY = graphY2 + graphH2 / 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(graphX, eqY);
        ctx.lineTo(graphX + graphW2, eqY);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#556";
        ctx.font = "9px sans-serif";
        ctx.fillText("equilibrium", graphX + graphW2 - 55, eqY - 4);

        if (diffState.history.length > 1) {
            const maxT = diffState.history[diffState.history.length - 1].t;
            const total = diffState.particles.length;

            // Left side line
            ctx.beginPath();
            diffState.history.forEach((h, i) => {
                const px = graphX + (h.t / maxT) * graphW2;
                const py = graphY2 + graphH2 - (h.left / total) * graphH2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#42a5f5";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Right side line
            ctx.beginPath();
            diffState.history.forEach((h, i) => {
                const px = graphX + (h.t / maxT) * graphW2;
                const py = graphY2 + graphH2 - (h.right / total) * graphH2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#ff9800";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        ctx.font = "10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#42a5f5"; ctx.fillText("Left", graphX + graphW2 - 80, graphY2 + 14);
        ctx.fillStyle = "#ff9800"; ctx.fillText("Right", graphX + graphW2 - 40, graphY2 + 14);

        ctx.textAlign = "center";
        ctx.font = "14px sans-serif";
        ctx.fillStyle = "#42a5f5";
        ctx.fillText(`Left: ${leftCount}`, midX / 2, wall + 20);
        ctx.fillStyle = "#ff9800";
        ctx.fillText(`Right: ${rightCount}`, midX + midX / 2, wall + 20);
        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:#7986cb">Diffusion</b><br>` +
            `Left: ${leftCount}<br>` +
            `Right: ${rightCount}<br>` +
            `Perm: ${perm}<br>` +
            `t: ${diffState.t.toFixed(1)} s`;

        if (diffState.running) {
            animId = requestAnimationFrame(drawDiffusion);
        }
    }

    bindSlider("diffParts", "val-diffParts", () => initDiffusion());
    bindSlider("perm", "val-perm");

    document.getElementById("btn-diff-start").addEventListener("click", () => {
        if (!diffState.running) {
            diffState.running = true;
            drawDiffusion();
        }
    });
    document.getElementById("btn-diff-reset").addEventListener("click", initDiffusion);

    // ═══════════════════════════════════════════════════════
    // 19. PENDULUM WAVE
    // ═══════════════════════════════════════════════════════
    let pwState = { t: 0, running: true };

    function initPendWave() {
        pwState = { t: 0, running: true };
        document.getElementById("btn-pw-toggle").textContent = "Pause";
        drawPendWave();
    }

    function drawPendWave() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const numPend = +document.getElementById("numPend").value;
        const speed = +document.getElementById("pwSpeed").value;

        // Support bar
        ctx.fillStyle = "#2a2f6e";
        ctx.fillRect(40, 30, W - 80, 10);

        const startX = 80;
        const endX = W - 80;
        const spacing = (endX - startX) / (numPend - 1);
        const baseLen = 120;
        const lenIncrement = 10;
        const pivotY = 40;
        const maxAngle = 0.6;

        if (pwState.running) {
            pwState.t += 0.02 * speed;
        }

        // Draw each pendulum
        for (let i = 0; i < numPend; i++) {
            const x = startX + i * spacing;
            const len = baseLen + i * lenIncrement;
            const freq = Math.sqrt(980 / len);
            const angle = maxAngle * Math.sin(freq * pwState.t);

            const bobX = x + len * Math.sin(angle);
            const bobY = pivotY + len * Math.cos(angle);

            // String
            ctx.beginPath();
            ctx.moveTo(x, pivotY);
            ctx.lineTo(bobX, bobY);
            ctx.strokeStyle = "rgba(136,136,170,0.6)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Bob
            const hue = (i / numPend) * 300;
            ctx.beginPath();
            ctx.arc(bobX, bobY, 8, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${hue}, 75%, 60%)`;
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(bobX, bobY, 12, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 75%, 60%, 0.15)`;
            ctx.fill();
        }

        // Draw wave pattern connecting bobs
        ctx.beginPath();
        for (let i = 0; i < numPend; i++) {
            const x = startX + i * spacing;
            const len = baseLen + i * lenIncrement;
            const freq = Math.sqrt(980 / len);
            const angle = maxAngle * Math.sin(freq * pwState.t);
            const bobX = x + len * Math.sin(angle);
            const bobY = pivotY + len * Math.cos(angle);
            i === 0 ? ctx.moveTo(bobX, bobY) : ctx.lineTo(bobX, bobY);
        }
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Phase diagram at bottom
        const phaseY = H - 90, phaseH = 60;
        ctx.fillStyle = "rgba(16, 20, 58, 0.7)";
        ctx.fillRect(40, phaseY, W - 80, phaseH);
        ctx.strokeStyle = "#2a2f6e";
        ctx.lineWidth = 1;
        ctx.strokeRect(40, phaseY, W - 80, phaseH);

        ctx.fillStyle = "#aab";
        ctx.font = "10px sans-serif";
        ctx.fillText("Phase Diagram", 50, phaseY - 4);

        for (let i = 0; i < numPend; i++) {
            const x = startX + i * spacing;
            const len = baseLen + i * lenIncrement;
            const freq = Math.sqrt(980 / len);
            const angle = maxAngle * Math.sin(freq * pwState.t);
            const barH = (angle / maxAngle) * (phaseH / 2);
            const hue = (i / numPend) * 300;
            ctx.fillStyle = `hsl(${hue}, 75%, 55%)`;
            ctx.fillRect(x - 3, phaseY + phaseH / 2, 6, -barH * 0.9);
        }

        // Center line
        ctx.beginPath();
        ctx.moveTo(40, phaseY + phaseH / 2);
        ctx.lineTo(W - 40, phaseY + phaseH / 2);
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.lineWidth = 1;
        ctx.stroke();

        overlay.innerHTML =
            `<b style="color:#ce93d8">Pendulum Wave</b><br>` +
            `Pendulums: ${numPend}<br>` +
            `Speed: ${speed}x<br>` +
            `t: ${pwState.t.toFixed(1)}`;

        if (pwState.running) {
            animId = requestAnimationFrame(drawPendWave);
        }
    }

    bindSlider("numPend", "val-numPend", () => { /* live */ });
    bindSlider("pwSpeed", "val-pwSpeed");

    document.getElementById("btn-pw-toggle").addEventListener("click", () => {
        pwState.running = !pwState.running;
        document.getElementById("btn-pw-toggle").textContent = pwState.running ? "Pause" : "Resume";
        if (pwState.running) drawPendWave();
    });
    document.getElementById("btn-pw-reset").addEventListener("click", initPendWave);

    // ═══════════════════════════════════════════════════════
    // 20. BUOYANCY (ARCHIMEDES)
    // ═══════════════════════════════════════════════════════
    let buoyState = {};

    function initBuoyancy() {
        buoyState = { y: 80, vy: 0, running: false };
        drawBuoyancy();
    }

    function drawBuoyancy() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const objDens = +document.getElementById("objDensity").value;
        const fluidDens = +document.getElementById("fluidDensity").value;
        const size = +document.getElementById("objSize").value;
        const g = 9.8;

        const waterLevel = 200;
        const objX = W / 2 - size / 2;

        // Equilibrium position: fraction submerged = objDens/fluidDens
        const fraction = Math.min(1, objDens / fluidDens);
        const eqY = waterLevel - size * (1 - fraction);

        if (buoyState.running) {
            // Simple spring-like physics toward equilibrium
            const submerged = Math.max(0, Math.min(size, buoyState.y + size - waterLevel));
            const buoyForce = fluidDens * g * submerged * 0.001;
            const weight = objDens * g * size * 0.001;
            const netForce = weight - buoyForce;
            const drag = buoyState.vy * 0.15;

            buoyState.vy += (netForce - drag) * 0.01;
            buoyState.y += buoyState.vy;

            // Floor
            if (buoyState.y + size > H - 20) {
                buoyState.y = H - 20 - size;
                buoyState.vy = 0;
            }
            // Ceiling
            if (buoyState.y < 20) { buoyState.y = 20; buoyState.vy = 0; }
        }

        // Sky
        ctx.fillStyle = "#0d1137";
        ctx.fillRect(0, 0, W, waterLevel);

        // Water
        const waterGrad = ctx.createLinearGradient(0, waterLevel, 0, H);
        waterGrad.addColorStop(0, "rgba(21, 101, 192, 0.5)");
        waterGrad.addColorStop(1, "rgba(13, 71, 161, 0.7)");
        ctx.fillStyle = waterGrad;
        ctx.fillRect(0, waterLevel, W, H - waterLevel);

        // Water surface waves
        ctx.beginPath();
        for (let x = 0; x < W; x++) {
            const y = waterLevel + Math.sin(x * 0.03 + Date.now() * 0.002) * 3;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(100, 180, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Object
        const submerged = Math.max(0, Math.min(size, buoyState.y + size - waterLevel));
        const aboveWater = size - submerged;

        // Part above water
        if (aboveWater > 0) {
            ctx.fillStyle = objDens > fluidDens ? "#ef5350" : "#ff9800";
            ctx.fillRect(objX, buoyState.y, size, aboveWater);
        }
        // Part below water
        if (submerged > 0) {
            ctx.fillStyle = objDens > fluidDens ? "rgba(239,83,80,0.7)" : "rgba(255,152,0,0.7)";
            ctx.fillRect(objX, waterLevel, size, submerged);
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(objX, buoyState.y, size, size);

        // Force arrows
        const centerX = W / 2;
        const centerY = buoyState.y + size / 2;

        // Weight (down)
        const wLen = objDens * size * 0.05;
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY);
        ctx.lineTo(centerX - 15, centerY + wLen);
        ctx.strokeStyle = "#ef5350";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - 15, centerY + wLen);
        ctx.lineTo(centerX - 20, centerY + wLen - 8);
        ctx.lineTo(centerX - 10, centerY + wLen - 8);
        ctx.closePath();
        ctx.fillStyle = "#ef5350";
        ctx.fill();
        ctx.fillStyle = "#ef5350";
        ctx.font = "11px sans-serif";
        ctx.fillText("W", centerX - 30, centerY + wLen / 2);

        // Buoyancy (up)
        if (submerged > 0) {
            const bLen = fluidDens * submerged * 0.05;
            ctx.beginPath();
            ctx.moveTo(centerX + 15, centerY);
            ctx.lineTo(centerX + 15, centerY - bLen);
            ctx.strokeStyle = "#42a5f5";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(centerX + 15, centerY - bLen);
            ctx.lineTo(centerX + 10, centerY - bLen + 8);
            ctx.lineTo(centerX + 20, centerY - bLen + 8);
            ctx.closePath();
            ctx.fillStyle = "#42a5f5";
            ctx.fill();
            ctx.fillStyle = "#42a5f5";
            ctx.fillText("F_b", centerX + 22, centerY - bLen / 2);
        }

        // Info panel
        const sinks = objDens > fluidDens;
        const pctSub = (fraction * 100).toFixed(0);
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(20, H - 120, 250, 100);
        ctx.strokeStyle = "#2a2f6e";
        ctx.lineWidth = 1;
        ctx.strokeRect(20, H - 120, 250, 100);
        ctx.fillStyle = "#ccc";
        ctx.font = "12px sans-serif";
        ctx.fillText(`Object: ${objDens} kg/m\u00b3`, 32, H - 98);
        ctx.fillText(`Fluid: ${fluidDens} kg/m\u00b3`, 32, H - 78);
        ctx.fillText(`Submerged: ${sinks ? "100% (sinks)" : pctSub + "%"}`, 32, H - 58);
        ctx.fillText(`Status: ${sinks ? "SINKS" : fraction < 1 ? "FLOATS" : "NEUTRAL"}`, 32, H - 38);

        overlay.innerHTML =
            `<b style="color:#42a5f5">Buoyancy</b><br>` +
            `\u03c1_obj: ${objDens}<br>` +
            `\u03c1_fluid: ${fluidDens}<br>` +
            `${sinks ? "Sinks!" : "Floats (" + pctSub + "%)"}`;

        if (buoyState.running) {
            animId = requestAnimationFrame(drawBuoyancy);
        }
    }

    bindSlider("objDensity", "val-objDensity", () => { if (!buoyState.running) drawBuoyancy(); });
    bindSlider("fluidDensity", "val-fluidDensity", () => { if (!buoyState.running) drawBuoyancy(); });
    bindSlider("objSize", "val-objSize", () => { if (!buoyState.running) drawBuoyancy(); });

    document.getElementById("btn-buoy-drop").addEventListener("click", () => {
        buoyState = { y: 40, vy: 0, running: true };
        drawBuoyancy();
    });
    document.getElementById("btn-buoy-reset").addEventListener("click", initBuoyancy);

    // ═══════════════════════════════════════════════════════
    // 21. COULOMB'S LAW
    // ═══════════════════════════════════════════════════════

    function initCoulomb() {
        drawCoulomb();
    }

    function drawCoulomb() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const q1 = +document.getElementById("q1").value;
        const q2 = +document.getElementById("q2").value;
        const sep = +document.getElementById("sep").value;
        const k = 8.99e9;

        const cy = H / 2 - 40;
        const c1x = W / 2 - sep / 2;
        const c2x = W / 2 + sep / 2;

        // Force calculation (in micro-units for display)
        const force = k * Math.abs(q1 * q2) / (sep * sep) * 0.01;
        const attractive = (q1 * q2) < 0;

        // Field lines between charges
        const numLines = 8;
        for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * Math.PI * 2;
            ctx.beginPath();
            let lx = c1x + 25 * Math.cos(angle);
            let ly = cy + 25 * Math.sin(angle);
            ctx.moveTo(lx, ly);

            for (let step = 0; step < 200; step++) {
                let ex = 0, ey = 0;
                // Field from q1
                const dx1 = lx - c1x, dy1 = ly - cy;
                const r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
                if (r1 > 5) { ex += q1 * dx1 / (r1 * r1 * r1); ey += q1 * dy1 / (r1 * r1 * r1); }
                // Field from q2
                const dx2 = lx - c2x, dy2 = ly - cy;
                const r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (r2 > 5) { ex += q2 * dx2 / (r2 * r2 * r2); ey += q2 * dy2 / (r2 * r2 * r2); }

                const mag = Math.sqrt(ex * ex + ey * ey);
                if (mag < 0.0001) break;
                lx += (ex / mag) * 5;
                ly += (ey / mag) * 5;
                if (lx < 0 || lx > W || ly < 0 || ly > H) break;
                if (Math.sqrt((lx - c2x) ** 2 + (ly - cy) ** 2) < 20) break;
                ctx.lineTo(lx, ly);
            }
            ctx.strokeStyle = "rgba(100,200,255,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Charge 1
        const r1 = 22 + Math.abs(q1) * 3;
        const g1 = ctx.createRadialGradient(c1x, cy, 3, c1x, cy, r1);
        g1.addColorStop(0, q1 > 0 ? "#ff5252" : "#448aff");
        g1.addColorStop(1, q1 > 0 ? "rgba(255,82,82,0.1)" : "rgba(68,138,255,0.1)");
        ctx.beginPath(); ctx.arc(c1x, cy, r1, 0, Math.PI * 2); ctx.fillStyle = g1; ctx.fill();
        ctx.beginPath(); ctx.arc(c1x, cy, r1 * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = q1 > 0 ? "#ff5252" : "#448aff"; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(q1 > 0 ? "+" : q1 < 0 ? "\u2212" : "0", c1x, cy + 6);
        ctx.font = "11px sans-serif";
        ctx.fillText(`q\u2081 = ${q1}\u00b5C`, c1x, cy + r1 + 18);

        // Charge 2
        const r2 = 22 + Math.abs(q2) * 3;
        const g2 = ctx.createRadialGradient(c2x, cy, 3, c2x, cy, r2);
        g2.addColorStop(0, q2 > 0 ? "#ff5252" : "#448aff");
        g2.addColorStop(1, q2 > 0 ? "rgba(255,82,82,0.1)" : "rgba(68,138,255,0.1)");
        ctx.beginPath(); ctx.arc(c2x, cy, r2, 0, Math.PI * 2); ctx.fillStyle = g2; ctx.fill();
        ctx.beginPath(); ctx.arc(c2x, cy, r2 * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = q2 > 0 ? "#ff5252" : "#448aff"; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 16px sans-serif";
        ctx.fillText(q2 > 0 ? "+" : q2 < 0 ? "\u2212" : "0", c2x, cy + 6);
        ctx.font = "11px sans-serif";
        ctx.fillText(`q\u2082 = ${q2}\u00b5C`, c2x, cy + r2 + 18);

        // Force arrows
        const fScale = Math.min(force * 50, 100);
        if (q1 !== 0 && q2 !== 0) {
            // Force on q1
            const dir1 = attractive ? 1 : -1;
            ctx.beginPath();
            ctx.moveTo(c1x + dir1 * (r1 + 5), cy);
            ctx.lineTo(c1x + dir1 * (r1 + 5 + fScale), cy);
            ctx.strokeStyle = "#ff9800"; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(c1x + dir1 * (r1 + 5 + fScale), cy);
            ctx.lineTo(c1x + dir1 * (r1 - 3 + fScale), cy - 5);
            ctx.lineTo(c1x + dir1 * (r1 - 3 + fScale), cy + 5);
            ctx.closePath(); ctx.fillStyle = "#ff9800"; ctx.fill();

            // Force on q2
            const dir2 = attractive ? -1 : 1;
            ctx.beginPath();
            ctx.moveTo(c2x + dir2 * (r2 + 5), cy);
            ctx.lineTo(c2x + dir2 * (r2 + 5 + fScale), cy);
            ctx.strokeStyle = "#ff9800"; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(c2x + dir2 * (r2 + 5 + fScale), cy);
            ctx.lineTo(c2x + dir2 * (r2 - 3 + fScale), cy - 5);
            ctx.lineTo(c2x + dir2 * (r2 - 3 + fScale), cy + 5);
            ctx.closePath(); ctx.fillStyle = "#ff9800"; ctx.fill();
        }

        // Distance marker
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(c1x, cy + 50); ctx.lineTo(c2x, cy + 50);
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif";
        ctx.fillText(`r = ${sep} px`, (c1x + c2x) / 2, cy + 66);

        // Force vs Distance graph
        const graphX = 50, graphY2 = 320, graphW2 = W - 100, graphH2 = 160;
        ctx.fillStyle = "rgba(16,20,58,0.8)";
        ctx.fillRect(graphX, graphY2, graphW2, graphH2);
        ctx.strokeStyle = "#2a2f6e";
        ctx.strokeRect(graphX, graphY2, graphW2, graphH2);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Force vs Distance (1/r\u00b2)", graphX + 8, graphY2 - 6);

        // Curve
        ctx.beginPath();
        for (let px = 5; px < graphW2; px++) {
            const r = 60 + (px / graphW2) * 440;
            const f = k * Math.abs(q1 * q2) / (r * r) * 0.01;
            const maxF = k * Math.abs(q1 * q2) / (60 * 60) * 0.01;
            const py = graphY2 + graphH2 - (f / maxF) * graphH2 * 0.9;
            px === 5 ? ctx.moveTo(graphX + px, py) : ctx.lineTo(graphX + px, py);
        }
        ctx.strokeStyle = "#ff9800"; ctx.lineWidth = 2; ctx.stroke();

        // Current position marker
        const curPx = graphX + ((sep - 60) / 440) * graphW2;
        const maxF = k * Math.abs(q1 * q2) / (60 * 60) * 0.01 || 1;
        const curPy = graphY2 + graphH2 - (force / maxF) * graphH2 * 0.9;
        ctx.beginPath(); ctx.arc(curPx, curPy, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffeb3b"; ctx.fill();

        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:#ff9800">Coulomb's Law</b><br>` +
            `q\u2081: ${q1} \u00b5C<br>` +
            `q\u2082: ${q2} \u00b5C<br>` +
            `r: ${sep} px<br>` +
            `F \u221d ${force.toFixed(2)}<br>` +
            `${attractive ? "Attractive" : "Repulsive"}`;
    }

    bindSlider("q1", "val-q1", () => { if (currentSim === "coulomb") drawCoulomb(); });
    bindSlider("q2", "val-q2", () => { if (currentSim === "coulomb") drawCoulomb(); });
    bindSlider("sep", "val-sep", () => { if (currentSim === "coulomb") drawCoulomb(); });
    document.getElementById("btn-coulomb-reset").addEventListener("click", () => {
        document.getElementById("q1").value = 3; document.getElementById("val-q1").textContent = "+3";
        document.getElementById("q2").value = -2; document.getElementById("val-q2").textContent = "-2";
        document.getElementById("sep").value = 200; document.getElementById("val-sep").textContent = "200";
        drawCoulomb();
    });

    // ═══════════════════════════════════════════════════════
    // 22. LISSAJOUS CURVES
    // ═══════════════════════════════════════════════════════
    let lissState = { t: 0, running: true, trail: [] };

    function initLissajous() {
        lissState = { t: 0, running: true, trail: [] };
        document.getElementById("btn-liss-toggle").textContent = "Pause";
        drawLissajous();
    }

    function drawLissajous() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const A = +document.getElementById("lissA").value;
        const B = +document.getElementById("lissB").value;
        const phase = +document.getElementById("lissPhase").value * Math.PI / 180;

        const cx = W / 2, cy = H / 2;
        const ampX = 200, ampY = 180;

        if (lissState.running) {
            lissState.t += 0.02;
        }

        // Draw complete curve (faded)
        ctx.beginPath();
        for (let t = 0; t < Math.PI * 2 + 0.1; t += 0.01) {
            const x = cx + ampX * Math.sin(A * t + phase);
            const y = cy + ampY * Math.sin(B * t);
            t === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(123, 97, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Animated trail
        const trailLen = 200;
        lissState.trail.push({
            x: cx + ampX * Math.sin(A * lissState.t + phase),
            y: cy + ampY * Math.sin(B * lissState.t)
        });
        if (lissState.trail.length > trailLen) lissState.trail.shift();

        if (lissState.trail.length > 1) {
            for (let i = 1; i < lissState.trail.length; i++) {
                const alpha = i / lissState.trail.length;
                const hue = (i / lissState.trail.length) * 120 + 200;
                ctx.beginPath();
                ctx.moveTo(lissState.trail[i - 1].x, lissState.trail[i - 1].y);
                ctx.lineTo(lissState.trail[i].x, lissState.trail[i].y);
                ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${alpha})`;
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
        }

        // Current point
        const px = lissState.trail[lissState.trail.length - 1];
        if (px) {
            const pg = ctx.createRadialGradient(px.x, px.y, 2, px.x, px.y, 10);
            pg.addColorStop(0, "#fff");
            pg.addColorStop(1, "rgba(123,97,255,0)");
            ctx.beginPath(); ctx.arc(px.x, px.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = pg; ctx.fill();
            ctx.beginPath(); ctx.arc(px.x, px.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#fff"; ctx.fill();
        }

        // Axes
        ctx.strokeStyle = "rgba(255,255,255,0.07)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx - ampX - 20, cy); ctx.lineTo(cx + ampX + 20, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy - ampY - 20); ctx.lineTo(cx, cy + ampY + 20); ctx.stroke();

        // Ratio display
        ctx.fillStyle = "#7b61ff";
        ctx.font = "bold 20px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${A} : ${B}`, cx, 30);
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#aab";
        ctx.fillText(`\u03b4 = ${(phase * 180 / Math.PI).toFixed(0)}\u00b0`, cx, 50);
        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:#7b61ff">Lissajous</b><br>` +
            `A: ${A} | B: ${B}<br>` +
            `Phase: ${(phase * 180 / Math.PI).toFixed(0)}\u00b0<br>` +
            `Ratio: ${A}:${B}`;

        if (lissState.running) {
            animId = requestAnimationFrame(drawLissajous);
        }
    }

    bindSlider("lissA", "val-lissA", () => { lissState.trail = []; });
    bindSlider("lissB", "val-lissB", () => { lissState.trail = []; });
    bindSlider("lissPhase", "val-lissPhase", () => { lissState.trail = []; });

    document.getElementById("btn-liss-toggle").addEventListener("click", () => {
        lissState.running = !lissState.running;
        document.getElementById("btn-liss-toggle").textContent = lissState.running ? "Pause" : "Resume";
        if (lissState.running) drawLissajous();
    });
    document.getElementById("btn-liss-reset").addEventListener("click", initLissajous);

    // ═══════════════════════════════════════════════════════
    // 23. BLACKBODY RADIATION
    // ═══════════════════════════════════════════════════════
    let bbCompareTemps = [];

    function initBlackbody() {
        bbCompareTemps = [];
        drawBlackbody();
    }

    function planck(wavelength, T) {
        const h = 6.626e-34, c = 3e8, kb = 1.381e-23;
        const l = wavelength * 1e-9;
        return (2 * h * c * c) / (Math.pow(l, 5) * (Math.exp((h * c) / (l * kb * T)) - 1));
    }

    function bbTempToRGB(T) {
        // Approximate color of blackbody at temperature T
        let r, g, b;
        T = T / 100;
        if (T <= 66) { r = 255; } else { r = Math.min(255, Math.max(0, 329.7 * Math.pow(T - 60, -0.133))); }
        if (T <= 66) { g = Math.min(255, Math.max(0, 99.47 * Math.log(T) - 161.1)); } else { g = Math.min(255, Math.max(0, 288.1 * Math.pow(T - 60, -0.0755))); }
        if (T >= 66) { b = 255; } else if (T <= 19) { b = 0; } else { b = Math.min(255, Math.max(0, 138.5 * Math.log(T - 10) - 305.0)); }
        return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
    }

    function drawBlackbody() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const T = +document.getElementById("bbTemp").value;
        const showWien = document.getElementById("showWien").checked;

        // Graph area
        const gx = 80, gy = 40, gw = W - 120, gh = 340;
        ctx.fillStyle = "rgba(16,20,58,0.6)";
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeStyle = "#2a2f6e"; ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy, gw, gh);

        // Wavelength range: 100nm to 3000nm
        const wlMin = 100, wlMax = 3000;

        // Find peak intensity for scaling
        let maxI = 0;
        const allTemps = [T, ...bbCompareTemps];
        allTemps.forEach(temp => {
            for (let wl = wlMin; wl < wlMax; wl += 10) {
                const I = planck(wl, temp);
                if (I > maxI) maxI = I;
            }
        });
        if (maxI === 0) maxI = 1;

        // Visible spectrum background
        const visMin = 380, visMax = 700;
        const visX1 = gx + ((visMin - wlMin) / (wlMax - wlMin)) * gw;
        const visX2 = gx + ((visMax - wlMin) / (wlMax - wlMin)) * gw;
        for (let px = Math.floor(visX1); px < Math.ceil(visX2); px++) {
            const wl = wlMin + ((px - gx) / gw) * (wlMax - wlMin);
            const t = (wl - 380) / 320;
            let r = 0, g = 0, b = 0;
            if (t < 0.2) { r = (0.2 - t) / 0.2 * 0.5; b = t / 0.2; }
            else if (t < 0.4) { b = 1 - (t - 0.2) / 0.2 * 0.5; g = (t - 0.2) / 0.2; }
            else if (t < 0.6) { g = 1; r = (t - 0.4) / 0.2; }
            else if (t < 0.8) { r = 1; g = 1 - (t - 0.6) / 0.2; }
            else { r = 1; }
            ctx.fillStyle = `rgba(${r * 255 | 0},${g * 255 | 0},${b * 255 | 0},0.08)`;
            ctx.fillRect(px, gy, 1, gh);
        }

        ctx.fillStyle = "#667"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("UV", gx + ((300 - wlMin) / (wlMax - wlMin)) * gw, gy + gh + 24);
        ctx.fillText("Visible", (visX1 + visX2) / 2, gy + gh + 24);
        ctx.fillText("Infrared", gx + ((1500 - wlMin) / (wlMax - wlMin)) * gw, gy + gh + 24);

        // Draw comparison curves
        const colors = ["rgba(255,152,0,0.4)", "rgba(76,175,80,0.4)", "rgba(171,71,188,0.4)"];
        bbCompareTemps.forEach((temp, idx) => {
            ctx.beginPath();
            for (let px = 0; px < gw; px += 2) {
                const wl = wlMin + (px / gw) * (wlMax - wlMin);
                const I = planck(wl, temp);
                const py = gy + gh - (I / maxI) * gh * 0.9;
                px === 0 ? ctx.moveTo(gx + px, py) : ctx.lineTo(gx + px, py);
            }
            ctx.strokeStyle = colors[idx % colors.length];
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.fillStyle = colors[idx % colors.length];
            ctx.font = "10px sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(`${temp} K`, gx + gw - 80, gy + 16 + idx * 14);
        });

        // Main curve
        ctx.beginPath();
        for (let px = 0; px < gw; px += 2) {
            const wl = wlMin + (px / gw) * (wlMax - wlMin);
            const I = planck(wl, T);
            const py = gy + gh - (I / maxI) * gh * 0.9;
            px === 0 ? ctx.moveTo(gx + px, py) : ctx.lineTo(gx + px, py);
        }
        ctx.strokeStyle = bbTempToRGB(T);
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Wien's displacement law: λ_max = b/T
        if (showWien) {
            const b = 2.898e6; // Wien's constant in nm·K
            const wlPeak = b / T;
            if (wlPeak >= wlMin && wlPeak <= wlMax) {
                const peakX = gx + ((wlPeak - wlMin) / (wlMax - wlMin)) * gw;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.moveTo(peakX, gy);
                ctx.lineTo(peakX, gy + gh);
                ctx.strokeStyle = "#ffeb3b";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = "#ffeb3b";
                ctx.font = "10px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`\u03bb_max = ${wlPeak.toFixed(0)} nm`, peakX, gy - 6);
            }
        }

        // X-axis labels
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        for (let wl = 500; wl <= 2500; wl += 500) {
            const px = gx + ((wl - wlMin) / (wlMax - wlMin)) * gw;
            ctx.fillText(`${wl}`, px, gy + gh + 12);
        }
        ctx.fillText("Wavelength (nm)", gx + gw / 2, gy + gh + 38);

        // Temperature color swatch
        ctx.beginPath();
        ctx.arc(W / 2, H - 40, 25, 0, Math.PI * 2);
        ctx.fillStyle = bbTempToRGB(T);
        ctx.fill();
        ctx.strokeStyle = "#555"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "#ccc"; ctx.font = "12px sans-serif";
        ctx.fillText(`${T} K`, W / 2, H - 12);
        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:${bbTempToRGB(T)}">Blackbody</b><br>` +
            `T: ${T} K<br>` +
            `\u03bb_peak: ${(2.898e6 / T).toFixed(0)} nm<br>` +
            `P \u221d T\u2074`;
    }

    bindSlider("bbTemp", "val-bbTemp", () => { if (currentSim === "blackbody") drawBlackbody(); });
    document.getElementById("showWien").addEventListener("change", () => { if (currentSim === "blackbody") drawBlackbody(); });
    document.getElementById("btn-bb-compare").addEventListener("click", () => {
        const T = +document.getElementById("bbTemp").value;
        if (bbCompareTemps.length < 3) bbCompareTemps.push(T);
        drawBlackbody();
    });
    document.getElementById("btn-bb-reset").addEventListener("click", initBlackbody);

    // ═══════════════════════════════════════════════════════
    // 24. ELASTIC COLLISIONS (1D)
    // ═══════════════════════════════════════════════════════
    let collState = {};

    function initCollision() {
        collState = { running: false, collided: false, t: 0,
            a: { x: 200, v: 0 }, b: { x: 550, v: 0 } };
        drawCollision();
    }

    function drawCollision() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const mA = +document.getElementById("massA").value;
        const mB = +document.getElementById("massB").value;
        const vA0 = +document.getElementById("velA").value;

        const trackY = 200;
        const rA = 15 + mA * 3, rB = 15 + mB * 3;

        if (collState.running) {
            collState.t++;
            collState.a.x += collState.a.v * 2;
            collState.b.x += collState.b.v * 2;

            // Collision detection
            if (!collState.collided && collState.a.x + rA >= collState.b.x - rB) {
                collState.collided = true;
                // Elastic collision formulas
                const v1f = ((mA - mB) / (mA + mB)) * collState.a.v + ((2 * mB) / (mA + mB)) * collState.b.v;
                const v2f = ((2 * mA) / (mA + mB)) * collState.a.v + ((mB - mA) / (mA + mB)) * collState.b.v;
                collState.a.v = v1f;
                collState.b.v = v2f;
            }

            // Walls
            if (collState.a.x - rA < 20) { collState.a.x = 20 + rA; collState.a.v *= -1; }
            if (collState.b.x + rB > W - 20) { collState.b.x = W - 20 - rB; collState.b.v *= -1; }
        }

        // Track
        ctx.fillStyle = "#1a2a1a";
        ctx.fillRect(20, trackY + 50, W - 40, 10);
        ctx.strokeStyle = "#2a4a2a"; ctx.lineWidth = 1;
        ctx.strokeRect(20, trackY + 50, W - 40, 10);

        // Object A
        const gA = ctx.createRadialGradient(collState.a.x - 3, trackY - 3, 2, collState.a.x, trackY, rA);
        gA.addColorStop(0, "#ef5350"); gA.addColorStop(1, "#b71c1c");
        ctx.beginPath(); ctx.arc(collState.a.x, trackY, rA, 0, Math.PI * 2);
        ctx.fillStyle = gA; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("A", collState.a.x, trackY + 4);
        ctx.font = "10px sans-serif"; ctx.fillStyle = "#ef5350";
        ctx.fillText(`${mA} kg`, collState.a.x, trackY + rA + 16);

        // Object B
        const gB = ctx.createRadialGradient(collState.b.x - 3, trackY - 3, 2, collState.b.x, trackY, rB);
        gB.addColorStop(0, "#42a5f5"); gB.addColorStop(1, "#0d47a1");
        ctx.beginPath(); ctx.arc(collState.b.x, trackY, rB, 0, Math.PI * 2);
        ctx.fillStyle = gB; ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 12px sans-serif";
        ctx.fillText("B", collState.b.x, trackY + 4);
        ctx.font = "10px sans-serif"; ctx.fillStyle = "#42a5f5";
        ctx.fillText(`${mB} kg`, collState.b.x, trackY + rB + 16);

        // Velocity arrows
        if (Math.abs(collState.a.v) > 0.1) {
            const len = collState.a.v * 15;
            ctx.beginPath();
            ctx.moveTo(collState.a.x, trackY - rA - 10);
            ctx.lineTo(collState.a.x + len, trackY - rA - 10);
            ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 2; ctx.stroke();
        }
        if (Math.abs(collState.b.v) > 0.1) {
            const len = collState.b.v * 15;
            ctx.beginPath();
            ctx.moveTo(collState.b.x, trackY - rB - 10);
            ctx.lineTo(collState.b.x + len, trackY - rB - 10);
            ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 2; ctx.stroke();
        }

        // Conservation display
        const pBefore = mA * vA0;
        const keBefore = 0.5 * mA * vA0 * vA0;
        const pAfter = mA * collState.a.v + mB * collState.b.v;
        const keAfter = 0.5 * mA * collState.a.v * collState.a.v + 0.5 * mB * collState.b.v * collState.b.v;

        const boxY = 300;
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(40, boxY, W - 80, 180);
        ctx.strokeStyle = "#2a2f6e"; ctx.lineWidth = 1;
        ctx.strokeRect(40, boxY, W - 80, 180);

        ctx.font = "13px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = "#7b61ff"; ctx.fillText("Conservation Laws", 60, boxY + 24);

        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#ccc";
        ctx.fillText("Before Collision:", 60, boxY + 50);
        ctx.fillText(`p = m\u2081v\u2081 = ${pBefore.toFixed(1)} kg\u00b7m/s`, 80, boxY + 70);
        ctx.fillText(`KE = \u00bdm\u2081v\u2081\u00b2 = ${keBefore.toFixed(1)} J`, 80, boxY + 90);

        ctx.fillText("After Collision:", 60, boxY + 116);
        ctx.fillStyle = collState.collided ? "#ccc" : "#556";
        ctx.fillText(`p = ${collState.collided ? pAfter.toFixed(1) : "?"} kg\u00b7m/s`, 80, boxY + 136);
        ctx.fillText(`KE = ${collState.collided ? keAfter.toFixed(1) : "?"} J`, 80, boxY + 156);

        if (collState.collided) {
            // Elastic collision formulas result
            const v1f = ((mA - mB) / (mA + mB)) * vA0;
            const v2f = ((2 * mA) / (mA + mB)) * vA0;
            ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif";
            ctx.fillText(`v\u2081' = ${v1f.toFixed(2)} m/s`, 400, boxY + 70);
            ctx.fillText(`v\u2082' = ${v2f.toFixed(2)} m/s`, 400, boxY + 90);

            // Verify conservation
            ctx.fillStyle = "#4caf50";
            ctx.fillText("\u2713 Momentum conserved", 400, boxY + 136);
            ctx.fillText("\u2713 Kinetic energy conserved", 400, boxY + 156);
        }

        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:#7b61ff">Elastic Collision</b><br>` +
            `v_A: ${collState.a.v.toFixed(2)} m/s<br>` +
            `v_B: ${collState.b.v.toFixed(2)} m/s<br>` +
            `${collState.collided ? "Collided!" : "Waiting..."}`;

        if (collState.running) {
            animId = requestAnimationFrame(drawCollision);
        }
    }

    bindSlider("massA", "val-massA", () => { if (!collState.running) drawCollision(); });
    bindSlider("massB", "val-massB", () => { if (!collState.running) drawCollision(); });
    bindSlider("velA", "val-velA", () => { if (!collState.running) drawCollision(); });

    document.getElementById("btn-coll-start").addEventListener("click", () => {
        const vA0 = +document.getElementById("velA").value;
        collState = { running: true, collided: false, t: 0,
            a: { x: 200, v: vA0 }, b: { x: 550, v: 0 } };
        drawCollision();
    });
    document.getElementById("btn-coll-reset").addEventListener("click", initCollision);

    // ═══════════════════════════════════════════════════════
    // 25. CELL DIVISION (MITOSIS)
    // ═══════════════════════════════════════════════════════
    let mitoState = {};

    const mitoPhases = [
        { name: "Interphase", color: "#4caf50", desc: "Cell grows, DNA replicates. Chromatin is loose and diffuse." },
        { name: "Prophase", color: "#ff9800", desc: "Chromatin condenses into visible chromosomes. Spindle fibers begin to form." },
        { name: "Metaphase", color: "#f44336", desc: "Chromosomes align at the cell's equator (metaphase plate)." },
        { name: "Anaphase", color: "#9c27b0", desc: "Sister chromatids separate and move to opposite poles." },
        { name: "Telophase", color: "#2196f3", desc: "Nuclear envelopes reform. Chromosomes decondense." },
        { name: "Cytokinesis", color: "#00bcd4", desc: "Cell membrane pinches inward, dividing into two daughter cells." }
    ];

    function initMitosis() {
        mitoState = { phase: 0, progress: 0, running: false };
        drawMitosis();
    }

    function drawMitosis() {
        const W = canvas.width, H = canvas.height;
        const speed = +document.getElementById("mitoSpeed").value;
        ctx.clearRect(0, 0, W, H);

        const cx = W / 2, cy = H / 2 - 20;
        const phase = mitoState.phase;
        const p = mitoState.progress; // 0 to 1 within phase

        if (mitoState.running) {
            mitoState.progress += 0.003 * speed;
            if (mitoState.progress >= 1) {
                mitoState.progress = 0;
                mitoState.phase++;
                if (mitoState.phase >= mitoPhases.length) {
                    mitoState.phase = mitoPhases.length - 1;
                    mitoState.progress = 1;
                    mitoState.running = false;
                }
            }
        }

        // Cell membrane
        if (phase < 5) {
            // Single cell
            const wobble = phase >= 4 ? Math.sin(p * Math.PI) * 8 : 0;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 140 + wobble, 120 - wobble * 0.3, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(200, 230, 200, 0.12)";
            ctx.fill();
            ctx.strokeStyle = "rgba(76, 175, 80, 0.6)";
            ctx.lineWidth = 3;
            ctx.stroke();
        } else {
            // Cytokinesis - pinching
            const pinch = p * 70;
            // Left daughter
            ctx.beginPath();
            ctx.ellipse(cx - 40 - pinch * 0.5, cy, 100 - pinch * 0.3, 110, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(200, 230, 200, 0.12)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0, 188, 212, 0.6)";
            ctx.lineWidth = 3;
            ctx.stroke();
            // Right daughter
            ctx.beginPath();
            ctx.ellipse(cx + 40 + pinch * 0.5, cy, 100 - pinch * 0.3, 110, 0, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(200, 230, 200, 0.12)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0, 188, 212, 0.6)";
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Nuclear envelope
        if (phase === 0 || phase >= 4) {
            const envAlpha = phase === 0 ? 0.5 : (phase === 4 ? p * 0.5 : 0.5);
            if (phase < 5) {
                ctx.beginPath();
                ctx.ellipse(cx, cy, 60, 50, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(156, 39, 176, ${envAlpha})`;
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.stroke();
                ctx.setLineDash([]);
            } else {
                // Two nuclei in daughter cells
                const pinch = p * 70;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.ellipse(cx - 40 - pinch * 0.5, cy, 35, 30, 0, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(156, 39, 176, 0.5)";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.beginPath();
                ctx.ellipse(cx + 40 + pinch * 0.5, cy, 35, 30, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        // Chromosomes
        const numChrom = 4;
        if (phase === 0) {
            // Interphase: diffuse chromatin
            for (let i = 0; i < 20; i++) {
                const angle = (i / 20) * Math.PI * 2;
                const r = 15 + Math.random() * 30;
                ctx.beginPath();
                ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), 2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(33, 150, 243, 0.4)";
                ctx.fill();
            }
        } else if (phase === 1) {
            // Prophase: condensing chromosomes
            const condense = p;
            for (let i = 0; i < numChrom; i++) {
                const angle = (i / numChrom) * Math.PI * 2 + 0.3;
                const r = 30 * (1 - condense * 0.3);
                const chX = cx + r * Math.cos(angle);
                const chY = cy + r * Math.sin(angle);
                // X-shaped chromosome
                const sz = 8 + condense * 10;
                ctx.lineWidth = 2 + condense * 2;
                ctx.strokeStyle = `hsl(${200 + i * 40}, 70%, 55%)`;
                ctx.beginPath();
                ctx.moveTo(chX - sz, chY - sz); ctx.lineTo(chX + sz, chY + sz);
                ctx.moveTo(chX + sz, chY - sz); ctx.lineTo(chX - sz, chY + sz);
                ctx.stroke();
            }
            // Spindle fibers forming
            if (p > 0.5) {
                const fAlpha = (p - 0.5) * 2;
                ctx.strokeStyle = `rgba(255, 235, 59, ${fAlpha * 0.3})`;
                ctx.lineWidth = 1;
                for (let i = 0; i < 6; i++) {
                    ctx.beginPath();
                    ctx.moveTo(cx - 130, cy);
                    ctx.lineTo(cx + (i - 3) * 15, cy);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(cx + 130, cy);
                    ctx.lineTo(cx + (i - 3) * 15, cy);
                    ctx.stroke();
                }
            }
        } else if (phase === 2) {
            // Metaphase: aligned at equator
            for (let i = 0; i < numChrom; i++) {
                const chY = cy - 30 + i * 20;
                const sz = 12;
                ctx.lineWidth = 3.5;
                ctx.strokeStyle = `hsl(${200 + i * 40}, 70%, 55%)`;
                ctx.beginPath();
                ctx.moveTo(cx - sz, chY - sz); ctx.lineTo(cx + sz, chY + sz);
                ctx.moveTo(cx + sz, chY - sz); ctx.lineTo(cx - sz, chY + sz);
                ctx.stroke();
            }
            // Spindle fibers
            ctx.strokeStyle = "rgba(255, 235, 59, 0.3)";
            ctx.lineWidth = 1;
            for (let i = 0; i < numChrom; i++) {
                const chY = cy - 30 + i * 20;
                ctx.beginPath(); ctx.moveTo(cx - 130, cy); ctx.lineTo(cx, chY); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + 130, cy); ctx.lineTo(cx, chY); ctx.stroke();
            }
            // Metaphase plate
            ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(cx, cy - 60); ctx.lineTo(cx, cy + 60);
            ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1; ctx.stroke();
            ctx.setLineDash([]);
        } else if (phase === 3) {
            // Anaphase: separating
            const sep = p * 80;
            for (let i = 0; i < numChrom; i++) {
                const chY = cy - 20 + i * 15;
                const sz = 8;
                // Left set
                ctx.lineWidth = 3;
                ctx.strokeStyle = `hsl(${200 + i * 40}, 70%, 55%)`;
                ctx.beginPath();
                ctx.moveTo(cx - sep - sz, chY - sz); ctx.lineTo(cx - sep, chY);
                ctx.moveTo(cx - sep + sz, chY - sz); ctx.lineTo(cx - sep, chY);
                ctx.stroke();
                // Right set
                ctx.beginPath();
                ctx.moveTo(cx + sep - sz, chY - sz); ctx.lineTo(cx + sep, chY);
                ctx.moveTo(cx + sep + sz, chY - sz); ctx.lineTo(cx + sep, chY);
                ctx.stroke();
            }
            // Spindle fibers pulling
            ctx.strokeStyle = "rgba(255, 235, 59, 0.2)";
            ctx.lineWidth = 1;
            for (let i = 0; i < numChrom; i++) {
                const chY = cy - 20 + i * 15;
                ctx.beginPath(); ctx.moveTo(cx - 130, cy); ctx.lineTo(cx - sep, chY); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx + 130, cy); ctx.lineTo(cx + sep, chY); ctx.stroke();
            }
        } else if (phase >= 4) {
            // Telophase / Cytokinesis: chromosomes at poles
            const offset = phase === 5 ? 40 + p * 70 : 80;
            for (let i = 0; i < numChrom; i++) {
                const chY = cy - 15 + i * 10;
                const sz = 6;
                ctx.lineWidth = 2;
                ctx.strokeStyle = `hsl(${200 + i * 40}, 60%, 50%)`;
                // Left cluster
                ctx.beginPath();
                ctx.moveTo(cx - offset - sz, chY - sz); ctx.lineTo(cx - offset, chY);
                ctx.moveTo(cx - offset + sz, chY - sz); ctx.lineTo(cx - offset, chY);
                ctx.stroke();
                // Right cluster
                ctx.beginPath();
                ctx.moveTo(cx + offset - sz, chY - sz); ctx.lineTo(cx + offset, chY);
                ctx.moveTo(cx + offset + sz, chY - sz); ctx.lineTo(cx + offset, chY);
                ctx.stroke();
            }
        }

        // Centrioles at poles (prophase onwards)
        if (phase >= 1 && phase <= 3) {
            ctx.fillStyle = "#ffeb3b";
            ctx.beginPath(); ctx.arc(cx - 130, cy, 5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(cx + 130, cy, 5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#aab"; ctx.font = "9px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Centriole", cx - 130, cy + 15);
            ctx.fillText("Centriole", cx + 130, cy + 15);
        }

        // Phase timeline at bottom
        const tlY = H - 70, tlH = 35;
        const phaseW = (W - 100) / mitoPhases.length;
        for (let i = 0; i < mitoPhases.length; i++) {
            const px = 50 + i * phaseW;
            const isActive = i === phase;
            ctx.fillStyle = isActive ? mitoPhases[i].color : "rgba(255,255,255,0.05)";
            if (isActive) ctx.globalAlpha = 0.7;
            ctx.fillRect(px, tlY, phaseW - 4, tlH);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = isActive ? mitoPhases[i].color : "#333";
            ctx.lineWidth = isActive ? 2 : 1;
            ctx.strokeRect(px, tlY, phaseW - 4, tlH);
            ctx.fillStyle = isActive ? "#fff" : "#667";
            ctx.font = isActive ? "bold 10px sans-serif" : "10px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(mitoPhases[i].name, px + (phaseW - 4) / 2, tlY + 14);
            // Progress bar within active phase
            if (isActive) {
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.fillRect(px + 2, tlY + tlH - 6, (phaseW - 8) * mitoState.progress, 4);
            }
        }

        // Phase description
        const phaseInfo = mitoPhases[phase];
        ctx.fillStyle = phaseInfo.color;
        ctx.font = "bold 18px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(phaseInfo.name, cx, 28);
        ctx.fillStyle = "#ccc";
        ctx.font = "13px sans-serif";
        ctx.fillText(phaseInfo.desc, cx, 50);
        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:${phaseInfo.color}">Mitosis</b><br>` +
            `Phase: ${phaseInfo.name}<br>` +
            `Progress: ${(mitoState.progress * 100).toFixed(0)}%<br>` +
            `Stage ${phase + 1}/${mitoPhases.length}`;

        if (mitoState.running) {
            animId = requestAnimationFrame(drawMitosis);
        }
    }

    bindSlider("mitoSpeed", "val-mitoSpeed");
    document.getElementById("btn-mito-start").addEventListener("click", () => {
        mitoState = { phase: 0, progress: 0, running: true };
        drawMitosis();
    });
    document.getElementById("btn-mito-reset").addEventListener("click", initMitosis);

    // ═══════════════════════════════════════════════════════
    // 26. PREDATOR-PREY (LOTKA-VOLTERRA)
    // ═══════════════════════════════════════════════════════
    let ppState = {};

    function initPredPrey() {
        ppState = { t: 0, prey: 40, pred: 9, running: true, history: [] };
        document.getElementById("btn-pp-toggle").textContent = "Pause";
        drawPredPrey();
    }

    function drawPredPrey() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const alpha = +document.getElementById("alpha").value;
        const beta = +document.getElementById("beta").value;
        const gamma = +document.getElementById("gamma").value;
        const delta = +document.getElementById("delta").value;
        const dt = 0.01;

        if (ppState.running) {
            // Runge-Kutta would be better, but Euler is simpler and sufficient for viz
            for (let i = 0; i < 5; i++) {
                const dPrey = (alpha * ppState.prey - beta * ppState.prey * ppState.pred) * dt;
                const dPred = (delta * ppState.prey * ppState.pred - gamma * ppState.pred) * dt;
                ppState.prey = Math.max(0.1, ppState.prey + dPrey);
                ppState.pred = Math.max(0.1, ppState.pred + dPred);
                ppState.t += dt;
            }
            ppState.history.push({ t: ppState.t, prey: ppState.prey, pred: ppState.pred });
            if (ppState.history.length > 800) ppState.history.shift();
        }

        // Population vs Time graph
        const gx = 60, gy = 30, gw = W - 120, gh = 200;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeStyle = "#2a2f6e"; ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy, gw, gh);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Population vs Time", gx + 8, gy - 6);

        if (ppState.history.length > 2) {
            let maxPop = 1;
            ppState.history.forEach(h => { maxPop = Math.max(maxPop, h.prey, h.pred); });
            const tMin = ppState.history[0].t;
            const tMax = ppState.history[ppState.history.length - 1].t;
            const tRange = Math.max(0.1, tMax - tMin);

            // Prey curve
            ctx.beginPath();
            ppState.history.forEach((h, i) => {
                const px = gx + ((h.t - tMin) / tRange) * gw;
                const py = gy + gh - (h.prey / maxPop) * gh * 0.9;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 2; ctx.stroke();

            // Predator curve
            ctx.beginPath();
            ppState.history.forEach((h, i) => {
                const px = gx + ((h.t - tMin) / tRange) * gw;
                const py = gy + gh - (h.pred / maxPop) * gh * 0.9;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#ef5350"; ctx.lineWidth = 2; ctx.stroke();
        }

        // Legend
        ctx.fillStyle = "#66bb6a"; ctx.font = "11px sans-serif";
        ctx.fillText(`Prey: ${ppState.prey.toFixed(1)}`, gx + gw - 150, gy + 18);
        ctx.fillStyle = "#ef5350";
        ctx.fillText(`Predators: ${ppState.pred.toFixed(1)}`, gx + gw - 150, gy + 34);

        // Phase portrait (Prey vs Predator)
        const px2 = 60, py2 = 260, pw2 = (W - 120) / 2 - 10, ph2 = 220;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(px2, py2, pw2, ph2);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(px2, py2, pw2, ph2);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif";
        ctx.fillText("Phase Portrait (Prey vs Pred)", px2 + 8, py2 - 6);
        ctx.fillStyle = "#667"; ctx.font = "9px sans-serif";
        ctx.fillText("Prey \u2192", px2 + pw2 / 2, py2 + ph2 + 12);
        ctx.save(); ctx.translate(px2 - 8, py2 + ph2 / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText("Predator \u2192", 0, 0); ctx.restore();

        if (ppState.history.length > 2) {
            let maxPrey = 1, maxPred = 1;
            ppState.history.forEach(h => { maxPrey = Math.max(maxPrey, h.prey); maxPred = Math.max(maxPred, h.pred); });

            ctx.beginPath();
            ppState.history.forEach((h, i) => {
                const x = px2 + (h.prey / maxPrey) * pw2 * 0.9 + 5;
                const y = py2 + ph2 - (h.pred / maxPred) * ph2 * 0.9 - 5;
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            });
            ctx.strokeStyle = "rgba(171, 71, 188, 0.6)"; ctx.lineWidth = 1.5; ctx.stroke();

            // Current point
            const last = ppState.history[ppState.history.length - 1];
            const lx = px2 + (last.prey / maxPrey) * pw2 * 0.9 + 5;
            const ly = py2 + ph2 - (last.pred / maxPred) * ph2 * 0.9 - 5;
            ctx.beginPath(); ctx.arc(lx, ly, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#fff"; ctx.fill();
        }

        // Ecosystem visualization
        const ex = px2 + pw2 + 20, ey = py2, ew = pw2, eh = ph2;
        ctx.fillStyle = "rgba(20, 50, 20, 0.5)";
        ctx.fillRect(ex, ey, ew, eh);
        ctx.strokeStyle = "#2a4a2a"; ctx.strokeRect(ex, ey, ew, eh);
        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Ecosystem View", ex + 8, ey - 6);

        // Draw prey (green circles)
        const numPreyDots = Math.min(60, Math.round(ppState.prey));
        for (let i = 0; i < numPreyDots; i++) {
            const dx = ex + 10 + (i % 10) * (ew - 20) / 10;
            const dy = ey + 15 + Math.floor(i / 10) * 18;
            ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#66bb6a"; ctx.fill();
        }
        // Draw predators (red triangles)
        const numPredDots = Math.min(30, Math.round(ppState.pred));
        for (let i = 0; i < numPredDots; i++) {
            const dx = ex + 15 + (i % 8) * (ew - 30) / 8;
            const dy = ey + eh - 20 - Math.floor(i / 8) * 22;
            ctx.beginPath();
            ctx.moveTo(dx, dy - 7); ctx.lineTo(dx - 6, dy + 5); ctx.lineTo(dx + 6, dy + 5);
            ctx.closePath();
            ctx.fillStyle = "#ef5350"; ctx.fill();
        }

        overlay.innerHTML =
            `<b style="color:#ab47bc">Predator-Prey</b><br>` +
            `Prey: ${ppState.prey.toFixed(1)}<br>` +
            `Predators: ${ppState.pred.toFixed(1)}<br>` +
            `t: ${ppState.t.toFixed(1)}`;

        if (ppState.running) {
            animId = requestAnimationFrame(drawPredPrey);
        }
    }

    bindSlider("alpha", "val-alpha");
    bindSlider("beta", "val-beta");
    bindSlider("gamma", "val-gamma");
    bindSlider("delta", "val-delta");

    document.getElementById("btn-pp-toggle").addEventListener("click", () => {
        ppState.running = !ppState.running;
        document.getElementById("btn-pp-toggle").textContent = ppState.running ? "Pause" : "Resume";
        if (ppState.running) drawPredPrey();
    });
    document.getElementById("btn-pp-reset").addEventListener("click", initPredPrey);

    // ═══════════════════════════════════════════════════════
    // 27. NATURAL SELECTION
    // ═══════════════════════════════════════════════════════
    let selState = {};

    function initSelection() {
        const organisms = [];
        for (let i = 0; i < 60; i++) {
            organisms.push({
                x: 40 + Math.random() * 820,
                y: 40 + Math.random() * 400,
                color: Math.random(), // 0=dark, 1=light
                size: 4 + Math.random() * 4,
                fitness: 0,
                alive: true
            });
        }
        selState = { organisms, running: true, generation: 0, t: 0, genHistory: [] };
        document.getElementById("btn-sel-toggle").textContent = "Pause";
        drawSelection();
    }

    function drawSelection() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const mutRate = +document.getElementById("mutRate").value;
        const selPress = +document.getElementById("selPress").value;
        const env = document.getElementById("selEnv").value;

        // Environment background
        if (env === "dark") {
            ctx.fillStyle = "#1a1a2e";
            ctx.fillRect(0, 0, W, H);
        } else if (env === "light") {
            ctx.fillStyle = "#c8c8a0";
            ctx.fillRect(0, 0, W, H);
        } else {
            // Patchy
            for (let px = 0; px < W; px += 60) {
                for (let py = 0; py < H; py += 60) {
                    const isDark = ((px / 60 + py / 60) % 2) < 1;
                    ctx.fillStyle = isDark ? "#1a1a2e" : "#b0b090";
                    ctx.fillRect(px, py, 60, 60);
                }
            }
        }

        const envBrightness = env === "dark" ? 0.1 : env === "light" ? 0.8 : 0.5;

        if (selState.running) {
            selState.t++;

            // Every 120 frames = one generation
            if (selState.t % 120 === 0) {
                selState.generation++;

                // Calculate fitness based on camouflage
                selState.organisms.forEach(o => {
                    if (!o.alive) return;
                    let localBg = envBrightness;
                    if (env === "mixed") {
                        const gx = Math.floor(o.x / 60), gy = Math.floor(o.y / 60);
                        localBg = ((gx + gy) % 2) < 1 ? 0.1 : 0.8;
                    }
                    const camouflage = 1 - Math.abs(o.color - localBg);
                    o.fitness = camouflage;
                });

                // Selection: kill the least fit
                const alive = selState.organisms.filter(o => o.alive);
                alive.sort((a, b) => a.fitness - b.fitness);
                const killCount = Math.floor(alive.length * selPress * 0.4);
                for (let i = 0; i < killCount && i < alive.length; i++) {
                    alive[i].alive = false;
                }

                // Reproduction: the survivors reproduce
                const survivors = selState.organisms.filter(o => o.alive);
                const offspring = [];
                while (survivors.length + offspring.length < 60 && survivors.length > 0) {
                    const parent = survivors[Math.floor(Math.random() * survivors.length)];
                    const child = {
                        x: 40 + Math.random() * 820,
                        y: 40 + Math.random() * 400,
                        color: Math.max(0, Math.min(1, parent.color + (Math.random() - 0.5) * mutRate * 2)),
                        size: Math.max(3, Math.min(8, parent.size + (Math.random() - 0.5) * 1)),
                        fitness: 0,
                        alive: true
                    };
                    offspring.push(child);
                }
                selState.organisms = [...survivors, ...offspring];

                // Record history
                const avgColor = selState.organisms.reduce((s, o) => s + o.color, 0) / selState.organisms.length;
                selState.genHistory.push({ gen: selState.generation, avgColor, pop: selState.organisms.length });
                if (selState.genHistory.length > 100) selState.genHistory.shift();
            }

            // Move organisms slightly
            selState.organisms.forEach(o => {
                if (!o.alive) return;
                o.x += (Math.random() - 0.5) * 3;
                o.y += (Math.random() - 0.5) * 3;
                o.x = Math.max(10, Math.min(W - 10, o.x));
                o.y = Math.max(10, Math.min(H - 80, o.y));
            });
        }

        // Draw organisms
        selState.organisms.forEach(o => {
            if (!o.alive) return;
            const gray = Math.round(o.color * 255);
            ctx.beginPath();
            ctx.arc(o.x, o.y, o.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${gray}, ${gray}, ${Math.round(gray * 0.8)})`;
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
        });

        // Stats bar at bottom
        const barY = H - 70, barH = 60;
        ctx.fillStyle = "rgba(16,20,58,0.9)";
        ctx.fillRect(0, barY, W, barH);

        // Generation history mini-graph
        if (selState.genHistory.length > 1) {
            ctx.beginPath();
            selState.genHistory.forEach((h, i) => {
                const px = 20 + (i / 100) * (W / 2 - 40);
                const py = barY + barH - 8 - h.avgColor * (barH - 16);
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 1.5; ctx.stroke();
        }

        ctx.fillStyle = "#ccc"; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`Generation: ${selState.generation}`, W / 2 + 20, barY + 18);
        const avgCol = selState.organisms.filter(o => o.alive).reduce((s, o) => s + o.color, 0) / Math.max(1, selState.organisms.filter(o => o.alive).length);
        ctx.fillText(`Avg brightness: ${avgCol.toFixed(3)}`, W / 2 + 20, barY + 36);
        ctx.fillText(`Population: ${selState.organisms.filter(o => o.alive).length}`, W / 2 + 20, barY + 54);
        ctx.fillStyle = "#ffeb3b"; ctx.font = "10px sans-serif";
        ctx.fillText("Avg brightness over generations \u2192", 20, barY + 12);

        const statsEl = document.getElementById("sel-stats");
        if (statsEl) {
            statsEl.innerHTML = `Gen ${selState.generation} | Pop: ${selState.organisms.filter(o => o.alive).length}`;
        }

        overlay.innerHTML =
            `<b style="color:#66bb6a">Natural Selection</b><br>` +
            `Gen: ${selState.generation}<br>` +
            `Avg color: ${avgCol.toFixed(2)}<br>` +
            `Env: ${env}`;

        if (selState.running) {
            animId = requestAnimationFrame(drawSelection);
        }
    }

    bindSlider("mutRate", "val-mutRate");
    bindSlider("selPress", "val-selPress");

    document.getElementById("btn-sel-toggle").addEventListener("click", () => {
        selState.running = !selState.running;
        document.getElementById("btn-sel-toggle").textContent = selState.running ? "Pause" : "Resume";
        if (selState.running) drawSelection();
    });
    document.getElementById("btn-sel-reset").addEventListener("click", initSelection);

    // ═══════════════════════════════════════════════════════
    // 28. NEURON ACTION POTENTIAL
    // ═══════════════════════════════════════════════════════
    let neuronState = {};

    function initNeuron() {
        neuronState = { firing: false, t: 0, potential: -70, history: [], axonProgress: -1 };
        drawNeuron();
    }

    function hodgkinHuxley(t, stimMul) {
        // Simplified action potential shape
        const stim = stimMul;
        if (t < 0) return -70;
        if (t < 0.5) return -70 + (stim * 20) * t * 2; // stimulus ramp
        if (t < 1.0) return -70 + stim * 20 + (40 + stim * 50) * (t - 0.5) * 2; // depolarization
        if (t < 1.5) return 30 * stim; // peak
        if (t < 2.5) return 30 * stim - (30 * stim + 80) * (t - 1.5); // repolarization
        if (t < 3.5) return -80 + 10 * (t - 2.5); // hyperpolarization recovery
        return -70;
    }

    function drawNeuron() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const stimStrength = +document.getElementById("stimulus").value;
        const thresh = +document.getElementById("threshold").value;

        if (neuronState.firing) {
            neuronState.t += 0.03;
            const stimPotential = hodgkinHuxley(neuronState.t, stimStrength);
            neuronState.potential = stimPotential;
            neuronState.history.push({ t: neuronState.t, v: neuronState.potential });

            // Check if reached threshold
            if (neuronState.potential > thresh && neuronState.axonProgress < 0) {
                neuronState.axonProgress = 0;
            }
            if (neuronState.axonProgress >= 0) {
                neuronState.axonProgress += 0.015;
            }

            if (neuronState.t > 4.5) {
                neuronState.firing = false;
            }
        }

        // ── Draw neuron anatomy ──
        // Cell body (soma)
        const somaX = 130, somaY = 160, somaR = 50;
        const somaGrad = ctx.createRadialGradient(somaX - 10, somaY - 10, 5, somaX, somaY, somaR);
        somaGrad.addColorStop(0, "rgba(156, 39, 176, 0.7)");
        somaGrad.addColorStop(1, "rgba(74, 20, 140, 0.3)");
        ctx.beginPath(); ctx.arc(somaX, somaY, somaR, 0, Math.PI * 2);
        ctx.fillStyle = somaGrad; ctx.fill();
        ctx.strokeStyle = "#ce93d8"; ctx.lineWidth = 2; ctx.stroke();

        // Nucleus
        ctx.beginPath(); ctx.arc(somaX, somaY, 18, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(233, 30, 99, 0.4)"; ctx.fill();
        ctx.strokeStyle = "rgba(233, 30, 99, 0.6)"; ctx.lineWidth = 1; ctx.stroke();

        // Dendrites
        const dendrites = [[-60, -40], [-70, -10], [-60, 30], [-40, -55], [-35, 50]];
        dendrites.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.moveTo(somaX + dx * 0.3, somaY + dy * 0.3);
            ctx.quadraticCurveTo(somaX + dx * 0.7, somaY + dy * 0.8, somaX + dx, somaY + dy);
            ctx.strokeStyle = "#ba68c8"; ctx.lineWidth = 2; ctx.stroke();
            // Branch tips
            ctx.beginPath(); ctx.arc(somaX + dx, somaY + dy, 2, 0, Math.PI * 2);
            ctx.fillStyle = "#ba68c8"; ctx.fill();
        });

        // Axon
        const axonStartX = somaX + somaR, axonEndX = W - 80;
        const axonY = 160;
        ctx.beginPath();
        ctx.moveTo(axonStartX, axonY);
        ctx.lineTo(axonEndX, axonY);
        ctx.strokeStyle = "#78909c"; ctx.lineWidth = 6; ctx.stroke();

        // Myelin sheaths
        const myelinCount = 6;
        const myelinLen = (axonEndX - axonStartX - 60) / myelinCount;
        for (let i = 0; i < myelinCount; i++) {
            const mx = axonStartX + 20 + i * myelinLen;
            ctx.fillStyle = "rgba(255, 235, 59, 0.2)";
            ctx.beginPath();
            ctx.ellipse(mx + myelinLen * 0.35, axonY, myelinLen * 0.35, 14, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 235, 59, 0.4)"; ctx.lineWidth = 1; ctx.stroke();
        }

        // Nodes of Ranvier labels
        ctx.fillStyle = "#667"; ctx.font = "8px sans-serif"; ctx.textAlign = "center";
        for (let i = 0; i <= myelinCount; i++) {
            const nx = axonStartX + 20 + i * myelinLen;
            if (i < myelinCount) ctx.fillText("Node", nx, axonY + 24);
        }

        // Action potential propagation along axon
        if (neuronState.axonProgress >= 0) {
            const apX = axonStartX + neuronState.axonProgress * (axonEndX - axonStartX);
            if (apX < axonEndX) {
                const grad = ctx.createRadialGradient(apX, axonY, 2, apX, axonY, 30);
                grad.addColorStop(0, "rgba(255, 235, 59, 0.9)");
                grad.addColorStop(0.5, "rgba(255, 152, 0, 0.4)");
                grad.addColorStop(1, "rgba(255, 152, 0, 0)");
                ctx.beginPath(); ctx.arc(apX, axonY, 30, 0, Math.PI * 2);
                ctx.fillStyle = grad; ctx.fill();
            }
        }

        // Axon terminal
        for (let i = 0; i < 4; i++) {
            const tx = axonEndX + 15 + Math.cos((-0.5 + i * 0.35) * Math.PI) * 25;
            const ty = axonY + Math.sin((-0.5 + i * 0.35) * Math.PI) * 25;
            ctx.beginPath();
            ctx.moveTo(axonEndX, axonY);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = "#78909c"; ctx.lineWidth = 2; ctx.stroke();
            ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI * 2);
            ctx.fillStyle = neuronState.axonProgress > 0.95 ? "#ff9800" : "#546e7a";
            ctx.fill();
        }

        // Neurotransmitter release
        if (neuronState.axonProgress > 0.95) {
            for (let i = 0; i < 8; i++) {
                const ntX = axonEndX + 30 + Math.random() * 30;
                const ntY = axonY - 20 + Math.random() * 40;
                ctx.beginPath(); ctx.arc(ntX, ntY, 2, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255, 152, 0, 0.6)"; ctx.fill();
            }
        }

        // Labels
        ctx.fillStyle = "#ce93d8"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Soma", somaX, somaY + somaR + 16);
        ctx.fillText("Dendrites", somaX - 50, somaY - 60);
        ctx.fillStyle = "#ffeb3b";
        ctx.fillText("Myelin Sheath", (axonStartX + axonEndX) / 2, axonY - 22);
        ctx.fillStyle = "#ff9800";
        ctx.fillText("Axon Terminal", axonEndX + 10, axonY + 50);

        // Voltage-time graph
        const gx = 50, gy2 = 240, gw = W - 100, gh = 230;
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(gx, gy2, gw, gh);
        ctx.strokeStyle = "#2a2f6e"; ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy2, gw, gh);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Membrane Potential vs Time", gx + 8, gy2 - 6);

        // Y axis: -80 to +40 mV
        const vMin = -80, vMax = 40;
        const vRange = vMax - vMin;

        // Grid lines
        ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
        [-70, -55, 0, 30].forEach(v => {
            const py = gy2 + gh - ((v - vMin) / vRange) * gh;
            ctx.beginPath(); ctx.moveTo(gx, py); ctx.lineTo(gx + gw, py); ctx.stroke();
            ctx.fillStyle = "#556"; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
            ctx.fillText(`${v}`, gx - 4, py + 4);
        });

        // Threshold line
        const threshY = gy2 + gh - ((thresh - vMin) / vRange) * gh;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(gx, threshY); ctx.lineTo(gx + gw, threshY);
        ctx.strokeStyle = "rgba(255, 82, 82, 0.5)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#ef5350"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Threshold", gx + gw - 60, threshY - 4);

        // Resting potential line
        const restY = gy2 + gh - ((-70 - vMin) / vRange) * gh;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(gx, restY); ctx.lineTo(gx + gw, restY);
        ctx.strokeStyle = "rgba(100, 200, 255, 0.3)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#64b5f6"; ctx.fillText("Resting (-70mV)", gx + 4, restY - 4);

        // Plot history
        if (neuronState.history.length > 1) {
            const maxT = Math.max(4.5, neuronState.history[neuronState.history.length - 1].t);
            ctx.beginPath();
            neuronState.history.forEach((h, i) => {
                const px = gx + (h.t / maxT) * gw;
                const py = gy2 + gh - ((h.v - vMin) / vRange) * gh;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 2.5; ctx.stroke();
        }

        // Phase labels on graph
        if (neuronState.history.length > 10) {
            ctx.font = "9px sans-serif"; ctx.textAlign = "center";
            const maxT = Math.max(4.5, neuronState.history[neuronState.history.length - 1].t);
            const phases = [
                { t: 0.3, label: "Stimulus", color: "#aab" },
                { t: 1.0, label: "Depolarization", color: "#ff9800" },
                { t: 1.5, label: "Peak", color: "#f44336" },
                { t: 2.0, label: "Repolarization", color: "#4caf50" },
                { t: 3.0, label: "Hyperpolarization", color: "#42a5f5" },
                { t: 4.0, label: "Recovery", color: "#aab" }
            ];
            phases.forEach(p => {
                if (neuronState.t > p.t) {
                    ctx.fillStyle = p.color;
                    ctx.fillText(p.label, gx + (p.t / maxT) * gw, gy2 + gh + 14);
                }
            });
        }

        ctx.textAlign = "start";

        const fired = neuronState.potential > thresh;
        overlay.innerHTML =
            `<b style="color:#ce93d8">Action Potential</b><br>` +
            `V_m: ${neuronState.potential.toFixed(1)} mV<br>` +
            `Threshold: ${thresh} mV<br>` +
            `${fired ? "FIRING!" : neuronState.firing ? "Stimulating..." : "Resting"}`;

        if (neuronState.firing) {
            animId = requestAnimationFrame(drawNeuron);
        }
    }

    bindSlider("stimulus", "val-stimulus");
    bindSlider("threshold", "val-threshold");

    document.getElementById("btn-neuron-fire").addEventListener("click", () => {
        neuronState = { firing: true, t: 0, potential: -70, history: [{ t: 0, v: -70 }], axonProgress: -1 };
        drawNeuron();
    });
    document.getElementById("btn-neuron-reset").addEventListener("click", initNeuron);

    // ═══════════════════════════════════════════════════════
    // 29. ENZYME KINETICS (MICHAELIS-MENTEN)
    // ═══════════════════════════════════════════════════════
    let enzState = {};

    function initEnzyme() {
        enzState = { running: false, t: 0, substrates: [], products: [], enzymeActive: false };
        drawEnzyme();
    }

    function drawEnzyme() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const Vmax = +document.getElementById("vmax").value;
        const Km = +document.getElementById("km").value;
        const S = +document.getElementById("substrate").value;
        const showLB = document.getElementById("showLB").checked;

        const V = (Vmax * S) / (Km + S);

        // ── Main Michaelis-Menten curve ──
        const gx = showLB ? 50 : 80, gy = 30;
        const gw = showLB ? (W - 120) / 2 : W - 160;
        const gh = showLB ? 220 : 280;

        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeStyle = "#2a2f6e"; ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy, gw, gh);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Michaelis-Menten Kinetics", gx + 8, gy - 6);

        // Axes
        ctx.fillStyle = "#667"; ctx.font = "9px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("[S] (substrate concentration)", gx + gw / 2, gy + gh + 28);
        ctx.save(); ctx.translate(gx - 20, gy + gh / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText("Reaction Rate (V)", 0, 0); ctx.restore();

        // Vmax line
        const vmaxY = gy + gh * 0.08;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(gx, vmaxY); ctx.lineTo(gx + gw, vmaxY);
        ctx.strokeStyle = "rgba(244, 67, 54, 0.5)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#f44336"; ctx.font = "10px sans-serif"; ctx.textAlign = "right";
        ctx.fillText(`V_max = ${Vmax}`, gx + gw - 4, vmaxY - 4);

        // Vmax/2 line
        const vhalfY = gy + gh * 0.08 + (gh * 0.85) / 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(gx, vhalfY); ctx.lineTo(gx + gw, vhalfY);
        ctx.strokeStyle = "rgba(255,152,0,0.3)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#ff9800"; ctx.font = "9px sans-serif";
        ctx.fillText(`V_max/2`, gx + gw - 4, vhalfY - 4);

        // Km marker
        const kmX = gx + (Km / 300) * gw;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(kmX, gy); ctx.lineTo(kmX, gy + gh);
        ctx.strokeStyle = "rgba(255,152,0,0.3)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#ff9800"; ctx.textAlign = "center";
        ctx.fillText(`K_m = ${Km}`, kmX, gy + gh + 14);

        // M-M curve
        ctx.beginPath();
        for (let px = 0; px < gw; px++) {
            const s = (px / gw) * 300;
            const v = (Vmax * s) / (Km + s);
            const py = gy + gh - (v / Vmax) * gh * 0.85 - gh * 0.07;
            px === 0 ? ctx.moveTo(gx + px, py) : ctx.lineTo(gx + px, py);
        }
        ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 2.5; ctx.stroke();

        // Current point
        const curX = gx + (S / 300) * gw;
        const curY = gy + gh - (V / Vmax) * gh * 0.85 - gh * 0.07;
        ctx.beginPath(); ctx.arc(curX, curY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ffeb3b"; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.stroke();

        // Lineweaver-Burk plot (double reciprocal)
        if (showLB) {
            const lbx = gx + gw + 30, lby = gy, lbw = gw, lbh = gh;
            ctx.fillStyle = "rgba(16,20,58,0.7)";
            ctx.fillRect(lbx, lby, lbw, lbh);
            ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(lbx, lby, lbw, lbh);

            ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
            ctx.fillText("Lineweaver-Burk Plot", lbx + 8, lby - 6);

            ctx.fillStyle = "#667"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("1/[S]", lbx + lbw / 2, lby + lbh + 28);
            ctx.save(); ctx.translate(lbx - 16, lby + lbh / 2); ctx.rotate(-Math.PI / 2);
            ctx.fillText("1/V", 0, 0); ctx.restore();

            // LB line: 1/V = (Km/Vmax)(1/S) + 1/Vmax
            const maxInvS = 0.2; // 1/S up to 0.2
            const slope = Km / Vmax;
            const intercept = 1 / Vmax;

            // Axes through origin area
            const originX = lbx + lbw * 0.3, originY = lby + lbh * 0.85;
            ctx.beginPath();
            ctx.moveTo(lbx + 10, originY); ctx.lineTo(lbx + lbw - 10, originY);
            ctx.moveTo(originX, lby + 10); ctx.lineTo(originX, lby + lbh - 10);
            ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1; ctx.stroke();

            // LB line
            ctx.beginPath();
            for (let px = 0; px < lbw; px++) {
                const invS = -0.05 + (px / lbw) * maxInvS;
                const invV = slope * invS + intercept;
                const x = originX + (invS / maxInvS) * (lbw * 0.65);
                const y = originY - (invV / (slope * maxInvS + intercept)) * (lbh * 0.7);
                if (y > lby && y < lby + lbh) {
                    px === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
            }
            ctx.strokeStyle = "#42a5f5"; ctx.lineWidth = 2; ctx.stroke();

            // Y-intercept = 1/Vmax
            const yIntY = originY - (intercept / (slope * maxInvS + intercept)) * (lbh * 0.7);
            ctx.beginPath(); ctx.arc(originX, yIntY, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#f44336"; ctx.fill();
            ctx.fillStyle = "#f44336"; ctx.font = "9px sans-serif"; ctx.textAlign = "left";
            ctx.fillText("1/V_max", originX + 8, yIntY);

            // X-intercept = -1/Km
            ctx.fillStyle = "#ff9800"; ctx.textAlign = "center";
            ctx.fillText("-1/K_m", originX - 30, originY + 14);

            // Current point on LB
            if (S > 0) {
                const curInvS = 1 / S;
                const curInvV = 1 / V;
                const cpx = originX + (curInvS / maxInvS) * (lbw * 0.65);
                const cpy = originY - (curInvV / (slope * maxInvS + intercept)) * (lbh * 0.7);
                if (cpy > lby && cpy < lby + lbh) {
                    ctx.beginPath(); ctx.arc(cpx, cpy, 5, 0, Math.PI * 2);
                    ctx.fillStyle = "#ffeb3b"; ctx.fill();
                }
            }
        }

        // Enzyme animation area
        const ey = showLB ? 280 : 340, eh = showLB ? 210 : 150;
        ctx.fillStyle = "rgba(16,20,58,0.5)";
        ctx.fillRect(50, ey, W - 100, eh);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(50, ey, W - 100, eh);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Enzyme-Substrate Interaction", 58, ey - 6);

        // Enzyme (lock shape)
        const enzX = W / 2, enzY = ey + eh / 2;
        ctx.beginPath();
        ctx.ellipse(enzX, enzY, 50, 35, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(76, 175, 80, 0.3)"; ctx.fill();
        ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 2; ctx.stroke();
        // Active site notch
        ctx.beginPath();
        ctx.moveTo(enzX - 15, enzY - 35);
        ctx.quadraticCurveTo(enzX, enzY - 20, enzX + 15, enzY - 35);
        ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#66bb6a"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Enzyme", enzX, enzY + 50);
        ctx.fillStyle = "#ffeb3b"; ctx.font = "9px sans-serif";
        ctx.fillText("Active Site", enzX, enzY - 40);

        // Substrates approaching
        if (enzState.running) {
            enzState.t += 0.02;
            // Animate substrate binding
            const bindPhase = (enzState.t % 3);
            if (bindPhase < 1) {
                // Substrate approaching
                const sx = enzX - 100 + bindPhase * 80;
                const sy = enzY - 50 - (1 - bindPhase) * 20;
                ctx.beginPath();
                ctx.moveTo(sx, sy); ctx.lineTo(sx - 10, sy - 15); ctx.lineTo(sx + 10, sy - 15);
                ctx.closePath();
                ctx.fillStyle = "#ff9800"; ctx.fill();
                ctx.fillStyle = "#ff9800"; ctx.font = "9px sans-serif";
                ctx.fillText("Substrate", sx, sy - 20);
            } else if (bindPhase < 2) {
                // Bound (ES complex)
                ctx.beginPath();
                ctx.moveTo(enzX, enzY - 35); ctx.lineTo(enzX - 10, enzY - 50); ctx.lineTo(enzX + 10, enzY - 50);
                ctx.closePath();
                ctx.fillStyle = "#ff9800"; ctx.fill();
                ctx.fillStyle = "#fff"; ctx.font = "10px sans-serif";
                ctx.fillText("ES Complex", enzX, enzY - 55);
            } else {
                // Product leaving
                const px2 = enzX + (bindPhase - 2) * 100;
                const py2 = enzY - 50 - (bindPhase - 2) * 20;
                ctx.beginPath(); ctx.arc(px2, py2, 7, 0, Math.PI * 2);
                ctx.fillStyle = "#42a5f5"; ctx.fill();
                ctx.beginPath(); ctx.arc(px2 + 12, py2, 5, 0, Math.PI * 2);
                ctx.fillStyle = "#42a5f5"; ctx.fill();
                ctx.fillStyle = "#42a5f5"; ctx.font = "9px sans-serif";
                ctx.fillText("Products", px2 + 5, py2 - 14);
            }
        }

        // Equation
        ctx.fillStyle = "#ccc"; ctx.font = "14px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`V = V_max \u00b7 [S] / (K_m + [S]) = ${V.toFixed(1)}`, W / 2, ey + eh + 20);

        ctx.textAlign = "start";

        overlay.innerHTML =
            `<b style="color:#66bb6a">Enzyme Kinetics</b><br>` +
            `V: ${V.toFixed(1)}<br>` +
            `V_max: ${Vmax}<br>` +
            `K_m: ${Km}<br>` +
            `[S]: ${S}<br>` +
            `Efficiency: ${(V / Vmax * 100).toFixed(0)}%`;

        if (enzState.running) {
            animId = requestAnimationFrame(drawEnzyme);
        }
    }

    bindSlider("vmax", "val-vmax", () => { if (currentSim === "enzyme") drawEnzyme(); });
    bindSlider("km", "val-km", () => { if (currentSim === "enzyme") drawEnzyme(); });
    bindSlider("substrate", "val-substrate", () => { if (currentSim === "enzyme") drawEnzyme(); });
    document.getElementById("showLB").addEventListener("change", () => { if (currentSim === "enzyme") drawEnzyme(); });

    document.getElementById("btn-enz-animate").addEventListener("click", () => {
        enzState = { running: true, t: 0 };
        drawEnzyme();
    });
    document.getElementById("btn-enz-reset").addEventListener("click", initEnzyme);

    // ═══════════════════════════════════════════════════════
    // 30. DNA REPLICATION
    // ═══════════════════════════════════════════════════════
    let dnaState = {};

    const basePairs = [
        { left: "A", right: "T", color: "#ef5350" },
        { left: "T", right: "A", color: "#42a5f5" },
        { left: "G", right: "C", color: "#66bb6a" },
        { left: "C", right: "G", color: "#ff9800" },
        { left: "A", right: "T", color: "#ef5350" },
        { left: "G", right: "C", color: "#66bb6a" },
        { left: "T", right: "A", color: "#42a5f5" },
        { left: "C", right: "G", color: "#ff9800" },
        { left: "A", right: "T", color: "#ef5350" },
        { left: "G", right: "C", color: "#66bb6a" },
        { left: "T", right: "A", color: "#42a5f5" },
        { left: "A", right: "T", color: "#ef5350" },
        { left: "C", right: "G", color: "#ff9800" },
        { left: "G", right: "C", color: "#66bb6a" },
        { left: "T", right: "A", color: "#42a5f5" },
        { left: "A", right: "T", color: "#ef5350" },
    ];

    function initDNA() {
        dnaState = { progress: 0, running: false };
        drawDNA();
    }

    function drawDNA() {
        const W = canvas.width, H = canvas.height;
        const speed = +document.getElementById("dnaSpeed").value;
        ctx.clearRect(0, 0, W, H);

        if (dnaState.running) {
            dnaState.progress += 0.003 * speed;
            if (dnaState.progress >= 1) {
                dnaState.progress = 1;
                dnaState.running = false;
            }
        }

        const forkX = 100 + dnaState.progress * (W - 250);
        const cy = H / 2;
        const bpSpacing = 35;
        const helixAmp = 40;

        // Title
        ctx.fillStyle = "#ce93d8";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("DNA Replication Fork", W / 2, 24);

        // Draw unreplicated double helix (right of fork)
        for (let i = 0; i < basePairs.length; i++) {
            const x = forkX + 50 + i * bpSpacing;
            if (x > W - 20) break;
            const phase = i * 0.5 + dnaState.progress * 3;
            const yOff = Math.sin(phase) * helixAmp;
            const depth = Math.cos(phase);

            // Draw back strand first if behind
            if (depth < 0) {
                // Back backbone
                ctx.beginPath();
                ctx.arc(x, cy + yOff, 5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(120, 144, 156, 0.4)";
                ctx.fill();
            }

            // Base pair bond (horizontal rung)
            ctx.beginPath();
            ctx.moveTo(x, cy - Math.abs(yOff) * 0.5);
            ctx.lineTo(x, cy + Math.abs(yOff) * 0.5);
            ctx.strokeStyle = `rgba(255,255,255,0.15)`;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Front backbone
            ctx.beginPath();
            ctx.arc(x, cy - yOff, 6, 0, Math.PI * 2);
            ctx.fillStyle = basePairs[i % basePairs.length].color;
            ctx.fill();

            if (depth >= 0) {
                ctx.beginPath();
                ctx.arc(x, cy + yOff, 6, 0, Math.PI * 2);
                ctx.fillStyle = basePairs[i % basePairs.length].color;
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // Base letters
            if (i < 6) {
                ctx.fillStyle = "#fff";
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.fillText(basePairs[i % basePairs.length].left, x, cy - yOff + 3);
                ctx.fillText(basePairs[i % basePairs.length].right, x, cy + yOff + 3);
            }
        }

        // Replication fork (Y shape)
        ctx.beginPath();
        ctx.moveTo(forkX + 30, cy);
        ctx.quadraticCurveTo(forkX + 10, cy - 30, forkX - 10, cy - 80);
        ctx.strokeStyle = "#ce93d8";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(forkX + 30, cy);
        ctx.quadraticCurveTo(forkX + 10, cy + 30, forkX - 10, cy + 80);
        ctx.strokeStyle = "#ce93d8";
        ctx.stroke();

        // Helicase at fork
        ctx.beginPath();
        ctx.arc(forkX + 30, cy, 14, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 235, 59, 0.4)";
        ctx.fill();
        ctx.strokeStyle = "#ffeb3b";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#ffeb3b";
        ctx.font = "8px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Helicase", forkX + 30, cy + 28);

        // Leading strand (top, continuous)
        const leadEnd = forkX - 10;
        const strandOffset = 80;
        // Template strand (top)
        ctx.beginPath();
        ctx.moveTo(forkX - 10, cy - strandOffset);
        ctx.lineTo(Math.max(40, leadEnd - dnaState.progress * 300), cy - strandOffset);
        ctx.strokeStyle = "#ef5350";
        ctx.lineWidth = 4;
        ctx.stroke();

        // New leading strand
        ctx.beginPath();
        ctx.moveTo(forkX - 10, cy - strandOffset + 20);
        ctx.lineTo(Math.max(60, leadEnd - dnaState.progress * 280), cy - strandOffset + 20);
        ctx.strokeStyle = "#42a5f5";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Base pairs on leading strand
        const numLeadBP = Math.floor(dnaState.progress * 8);
        for (let i = 0; i < numLeadBP; i++) {
            const bx = forkX - 20 - i * 30;
            if (bx < 40) break;
            ctx.beginPath();
            ctx.moveTo(bx, cy - strandOffset + 2);
            ctx.lineTo(bx, cy - strandOffset + 18);
            ctx.strokeStyle = basePairs[i % basePairs.length].color;
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // DNA Polymerase on leading strand
        if (dnaState.progress > 0.05) {
            const polyX = Math.max(70, forkX - dnaState.progress * 280);
            ctx.beginPath();
            ctx.arc(polyX, cy - strandOffset + 10, 12, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(76, 175, 80, 0.5)";
            ctx.fill();
            ctx.strokeStyle = "#66bb6a";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "#66bb6a";
            ctx.font = "7px sans-serif";
            ctx.fillText("Pol III", polyX, cy - strandOffset + 30);
        }

        // Lagging strand (bottom, Okazaki fragments)
        ctx.beginPath();
        ctx.moveTo(forkX - 10, cy + strandOffset);
        ctx.lineTo(Math.max(40, leadEnd - dnaState.progress * 300), cy + strandOffset);
        ctx.strokeStyle = "#ef5350";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Okazaki fragments
        const numFragments = Math.floor(dnaState.progress * 5);
        for (let f = 0; f < numFragments; f++) {
            const fragStart = forkX - 30 - f * 55;
            const fragEnd = fragStart - 40;
            if (fragEnd < 30) break;
            ctx.beginPath();
            ctx.moveTo(fragStart, cy + strandOffset - 20);
            ctx.lineTo(fragEnd, cy + strandOffset - 20);
            ctx.strokeStyle = "#42a5f5";
            ctx.lineWidth = 4;
            ctx.stroke();

            // Base pairs
            for (let b = 0; b < 3; b++) {
                const bpx = fragStart - 5 - b * 12;
                if (bpx > fragEnd) {
                    ctx.beginPath();
                    ctx.moveTo(bpx, cy + strandOffset - 2);
                    ctx.lineTo(bpx, cy + strandOffset - 18);
                    ctx.strokeStyle = basePairs[(f * 3 + b) % basePairs.length].color;
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
            }

            // RNA primer at start of each fragment
            ctx.beginPath();
            ctx.moveTo(fragStart + 2, cy + strandOffset - 20);
            ctx.lineTo(fragStart + 10, cy + strandOffset - 20);
            ctx.strokeStyle = "#ff9800";
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Labels
        ctx.font = "12px sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#ef5350";
        ctx.fillText("3'", forkX - 5, cy - strandOffset - 8);
        ctx.fillText("5'", 25, cy - strandOffset - 8);
        ctx.fillStyle = "#42a5f5";
        ctx.fillText("Leading strand (continuous)", 25, cy - strandOffset + 38);

        ctx.fillStyle = "#ef5350";
        ctx.fillText("5'", forkX - 5, cy + strandOffset + 18);
        ctx.fillText("3'", 25, cy + strandOffset + 18);
        ctx.fillStyle = "#42a5f5";
        ctx.fillText("Lagging strand (Okazaki fragments)", 25, cy + strandOffset - 30);
        ctx.fillStyle = "#ff9800";
        ctx.font = "10px sans-serif";
        ctx.fillText("Orange = RNA primers", 25, cy + strandOffset - 42);

        // Legend
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(W - 200, H - 100, 180, 85);
        ctx.strokeStyle = "#2a2f6e";
        ctx.strokeRect(W - 200, H - 100, 180, 85);
        ctx.font = "10px sans-serif";
        ctx.textAlign = "left";
        ctx.fillStyle = "#ef5350"; ctx.fillText("Template strands", W - 185, H - 82);
        ctx.fillStyle = "#42a5f5"; ctx.fillText("New strands", W - 185, H - 66);
        ctx.fillStyle = "#ffeb3b"; ctx.fillText("Helicase (unwinds)", W - 185, H - 50);
        ctx.fillStyle = "#66bb6a"; ctx.fillText("DNA Polymerase III", W - 185, H - 34);
        ctx.fillStyle = "#ff9800"; ctx.fillText("RNA Primers (Primase)", W - 185, H - 18);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#ce93d8">DNA Replication</b><br>` +
            `Progress: ${(dnaState.progress * 100).toFixed(0)}%<br>` +
            `Direction: 5' \u2192 3'<br>` +
            `Okazaki fragments: ${numFragments}`;

        if (dnaState.running) {
            animId = requestAnimationFrame(drawDNA);
        }
    }

    bindSlider("dnaSpeed", "val-dnaSpeed");
    document.getElementById("btn-dna-start").addEventListener("click", () => {
        dnaState = { progress: 0, running: true };
        drawDNA();
    });
    document.getElementById("btn-dna-reset").addEventListener("click", initDNA);

    // ═══════════════════════════════════════════════════════
    // 31. PHOTOSYNTHESIS
    // ═══════════════════════════════════════════════════════
    let photoState = { t: 0, running: true, atp: 0, nadph: 0, o2: 0, glucose: 0 };

    function initPhotosyn() {
        photoState = { t: 0, running: true, atp: 0, nadph: 0, o2: 0, glucose: 0, particles: [] };
        document.getElementById("btn-photo-toggle").textContent = "Pause";
        drawPhotosyn();
    }

    function drawPhotosyn() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const lightInt = +document.getElementById("lightInt").value;
        const co2Level = +document.getElementById("co2").value;
        const temp = +document.getElementById("photoTemp").value;

        // Efficiency based on conditions
        const tempEff = 1 - Math.abs(temp - 25) / 30;
        const rate = (lightInt / 100) * (co2Level / 100) * Math.max(0.1, tempEff);

        if (photoState.running) {
            photoState.t += 0.016;
            photoState.atp += rate * 0.05;
            photoState.nadph += rate * 0.03;
            photoState.o2 += rate * 0.04;
            photoState.glucose += rate * 0.01;

            // Add light photon particles
            if (Math.random() < lightInt / 200) {
                photoState.particles.push({
                    x: 50 + Math.random() * 200, y: 0,
                    vx: 0.5, vy: 2 + Math.random(),
                    type: "photon", life: 1
                });
            }
            // Add CO2 particles
            if (Math.random() < co2Level / 500) {
                photoState.particles.push({
                    x: W - 50, y: 80 + Math.random() * 100,
                    vx: -1.5, vy: (Math.random() - 0.5) * 0.5,
                    type: "co2", life: 1
                });
            }
            // Add O2 output
            if (Math.random() < rate * 0.05) {
                photoState.particles.push({
                    x: 300 + Math.random() * 100, y: 80,
                    vx: (Math.random() - 0.5) * 0.5, vy: -1.5,
                    type: "o2", life: 1
                });
            }

            photoState.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 0.005;
            });
            photoState.particles = photoState.particles.filter(p => p.life > 0 && p.x > -10 && p.x < W + 10 && p.y > -10 && p.y < H + 10);
            if (photoState.particles.length > 150) photoState.particles.splice(0, 20);
        }

        // Sun
        const sunGrad = ctx.createRadialGradient(60, 40, 10, 60, 40, 50);
        sunGrad.addColorStop(0, `rgba(255,235,59,${lightInt / 100})`);
        sunGrad.addColorStop(1, "rgba(255,235,59,0)");
        ctx.beginPath(); ctx.arc(60, 40, 50, 0, Math.PI * 2);
        ctx.fillStyle = sunGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(60, 40, 20, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,235,59,${lightInt / 100})`; ctx.fill();

        // Light rays
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 0.6 + 0.3;
            ctx.beginPath();
            ctx.moveTo(60 + 25 * Math.cos(angle), 40 + 25 * Math.sin(angle));
            ctx.lineTo(60 + 70 * Math.cos(angle), 40 + 70 * Math.sin(angle));
            ctx.strokeStyle = `rgba(255,235,59,${lightInt / 300})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Chloroplast (large ellipse)
        const chloroX = W / 2 - 50, chloroY = H / 2 + 20;
        ctx.beginPath();
        ctx.ellipse(chloroX, chloroY, 250, 120, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(27, 94, 32, 0.3)";
        ctx.fill();
        ctx.strokeStyle = "#43a047";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Outer membrane label
        ctx.fillStyle = "#43a047"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Chloroplast", chloroX, chloroY - 128);

        // Thylakoid stack (granum)
        const thyX = chloroX - 100, thyY = chloroY;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.ellipse(thyX, thyY - 30 + i * 15, 60, 8, 0, 0, Math.PI * 2);
            const glow = rate > 0.3 ? 0.3 + Math.sin(photoState.t * 3 + i) * 0.15 : 0.2;
            ctx.fillStyle = `rgba(76, 175, 80, ${glow + 0.2})`;
            ctx.fill();
            ctx.strokeStyle = "rgba(129, 199, 132, 0.6)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        ctx.fillStyle = "#81c784"; ctx.font = "10px sans-serif";
        ctx.fillText("Thylakoid", thyX, thyY + 50);
        ctx.fillText("(Light Reactions)", thyX, thyY + 63);

        // Stroma region
        ctx.fillStyle = "rgba(165, 214, 167, 0.15)";
        ctx.beginPath();
        ctx.ellipse(chloroX + 80, chloroY, 100, 80, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(165, 214, 167, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#a5d6a7"; ctx.font = "10px sans-serif";
        ctx.fillText("Stroma", chloroX + 80, chloroY + 90);
        ctx.fillText("(Calvin Cycle)", chloroX + 80, chloroY + 103);

        // Calvin cycle icon
        ctx.beginPath();
        ctx.arc(chloroX + 80, chloroY, 35, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(165, 214, 167, ${0.3 + rate * 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        // Arrow on cycle
        const cycAngle = photoState.t * 2;
        const arrowX = chloroX + 80 + 35 * Math.cos(cycAngle);
        const arrowY = chloroY + 35 * Math.sin(cycAngle);
        ctx.beginPath(); ctx.arc(arrowX, arrowY, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#a5d6a7"; ctx.fill();

        // Arrows between light reactions and Calvin cycle
        ctx.beginPath();
        ctx.moveTo(thyX + 65, thyY - 15);
        ctx.lineTo(chloroX + 30, chloroY - 20);
        ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#ffeb3b"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("ATP", (thyX + 65 + chloroX + 30) / 2, thyY - 25);

        ctx.beginPath();
        ctx.moveTo(thyX + 65, thyY + 10);
        ctx.lineTo(chloroX + 30, chloroY + 15);
        ctx.strokeStyle = "#ce93d8"; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#ce93d8";
        ctx.fillText("NADPH", (thyX + 65 + chloroX + 30) / 2, thyY + 25);

        // Draw particles
        photoState.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            if (p.type === "photon") {
                ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = "#ffeb3b"; ctx.fill();
            } else if (p.type === "co2") {
                ctx.fillStyle = "#90a4ae"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
                ctx.fillText("CO\u2082", p.x, p.y);
            } else if (p.type === "o2") {
                ctx.fillStyle = "#42a5f5"; ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
                ctx.fillText("O\u2082", p.x, p.y);
            }
            ctx.globalAlpha = 1;
        });

        // Equation
        ctx.fillStyle = "#ccc"; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("6CO\u2082 + 6H\u2082O + Light \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082", W / 2, H - 60);

        // Rate bar
        ctx.fillStyle = "rgba(16,20,58,0.8)";
        ctx.fillRect(W - 220, H - 100, 200, 85);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(W - 220, H - 100, 200, 85);
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`Rate: ${(rate * 100).toFixed(0)}%`, W - 210, H - 82);
        ctx.fillStyle = "#ffeb3b"; ctx.fillText(`ATP: ${photoState.atp.toFixed(0)}`, W - 210, H - 66);
        ctx.fillStyle = "#ce93d8"; ctx.fillText(`NADPH: ${photoState.nadph.toFixed(0)}`, W - 210, H - 50);
        ctx.fillStyle = "#42a5f5"; ctx.fillText(`O\u2082: ${photoState.o2.toFixed(0)}`, W - 210, H - 34);
        ctx.fillStyle = "#66bb6a"; ctx.fillText(`Glucose: ${photoState.glucose.toFixed(1)}`, W - 210, H - 18);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#66bb6a">Photosynthesis</b><br>` +
            `Rate: ${(rate * 100).toFixed(0)}%<br>` +
            `ATP: ${photoState.atp.toFixed(0)}<br>` +
            `Glucose: ${photoState.glucose.toFixed(1)}`;

        if (photoState.running) {
            animId = requestAnimationFrame(drawPhotosyn);
        }
    }

    bindSlider("lightInt", "val-lightInt", () => { /* live */ });
    bindSlider("co2", "val-co2", () => { /* live */ });
    bindSlider("photoTemp", "val-photoTemp", () => { /* live */ });

    document.getElementById("btn-photo-toggle").addEventListener("click", () => {
        photoState.running = !photoState.running;
        document.getElementById("btn-photo-toggle").textContent = photoState.running ? "Pause" : "Resume";
        if (photoState.running) drawPhotosyn();
    });
    document.getElementById("btn-photo-reset").addEventListener("click", initPhotosyn);

    // ═══════════════════════════════════════════════════════
    // 32. HARDY-WEINBERG EQUILIBRIUM
    // ═══════════════════════════════════════════════════════
    let hwState = {};

    function initHardyWein() {
        hwState = { history: [], done: false };
        drawHardyWein();
    }

    function drawHardyWein() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const p = +document.getElementById("pfreq").value;
        const q = 1 - p;
        const popSize = +document.getElementById("hwPop").value;
        const gens = +document.getElementById("hwGens").value;
        const drift = document.getElementById("hwDrift").checked;

        // Expected frequencies
        const pp = p * p;
        const pq2 = 2 * p * q;
        const qq = q * q;

        // Genotype bar chart
        const barX = 60, barY = 40, barW = 250, barH = 200;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(barX, barY, barW, barH);

        ctx.fillStyle = "#aab"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Genotype Frequencies", barX + barW / 2, barY - 8);

        const genotypes = [
            { label: "AA", freq: pp, color: "#ef5350" },
            { label: "Aa", freq: pq2, color: "#ff9800" },
            { label: "aa", freq: qq, color: "#42a5f5" }
        ];

        const bw = 50, gap = 30;
        const totalW = genotypes.length * bw + (genotypes.length - 1) * gap;
        const startX = barX + (barW - totalW) / 2;

        genotypes.forEach((g, i) => {
            const bx = startX + i * (bw + gap);
            const bh = g.freq * (barH - 40);
            ctx.fillStyle = g.color;
            ctx.fillRect(bx, barY + barH - 20 - bh, bw, bh);
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.strokeRect(bx, barY + barH - 20 - bh, bw, bh);

            ctx.fillStyle = "#fff"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
            ctx.fillText(g.label, bx + bw / 2, barY + barH - 4);
            ctx.fillStyle = g.color; ctx.font = "11px sans-serif";
            ctx.fillText(`${(g.freq * 100).toFixed(1)}%`, bx + bw / 2, barY + barH - 24 - bh);
        });

        // Population visualization (colored dots)
        const popX = 350, popY = 40, popW = W - 380, popH = 200;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(popX, popY, popW, popH);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(popX, popY, popW, popH);

        ctx.fillStyle = "#aab"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`Population (n=${popSize})`, popX + popW / 2, popY - 8);

        const dotsPerRow = Math.ceil(Math.sqrt(popSize * popW / popH));
        const dotSpacingX = popW / dotsPerRow;
        const dotSpacingY = popH / Math.ceil(popSize / dotsPerRow);
        const dotR = Math.min(dotSpacingX, dotSpacingY) * 0.35;

        for (let i = 0; i < popSize; i++) {
            const col = i % dotsPerRow;
            const row = Math.floor(i / dotsPerRow);
            const dx = popX + 8 + col * dotSpacingX;
            const dy = popY + 8 + row * dotSpacingY;
            if (dy > popY + popH - 5) break;

            // Determine genotype for this individual
            const r = i / popSize;
            let color;
            if (r < pp) color = "#ef5350";
            else if (r < pp + pq2) color = "#ff9800";
            else color = "#42a5f5";

            ctx.beginPath(); ctx.arc(dx, dy, dotR, 0, Math.PI * 2);
            ctx.fillStyle = color; ctx.fill();
        }

        // Allele frequency over generations (simulation)
        const gx = 50, gy2 = 280, gw2 = W - 100, gh2 = 200;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(gx, gy2, gw2, gh2);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(gx, gy2, gw2, gh2);

        ctx.fillStyle = "#aab"; ctx.font = "12px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Allele Frequency Over Generations" + (drift ? " (with drift)" : " (ideal)"), gx + 8, gy2 - 8);

        // Y-axis
        ctx.fillStyle = "#556"; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
        [0, 0.25, 0.5, 0.75, 1.0].forEach(v => {
            const py = gy2 + gh2 - v * gh2;
            ctx.fillText(v.toFixed(2), gx - 4, py + 4);
            ctx.beginPath(); ctx.moveTo(gx, py); ctx.lineTo(gx + gw2, py);
            ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.stroke();
        });

        if (hwState.history.length > 0) {
            // p allele
            ctx.beginPath();
            hwState.history.forEach((h, i) => {
                const px = gx + (i / (hwState.history.length - 1)) * gw2;
                const py = gy2 + gh2 - h.p * gh2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#ef5350"; ctx.lineWidth = 2; ctx.stroke();

            // q allele
            ctx.beginPath();
            hwState.history.forEach((h, i) => {
                const px = gx + (i / (hwState.history.length - 1)) * gw2;
                const py = gy2 + gh2 - h.q * gh2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#42a5f5"; ctx.lineWidth = 2; ctx.stroke();

            // Equilibrium line
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(gx, gy2 + gh2 - p * gh2);
            ctx.lineTo(gx + gw2, gy2 + gh2 - p * gh2);
            ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1; ctx.stroke();
            ctx.setLineDash([]);
        }

        // Legend
        ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = "#ef5350"; ctx.fillText("p (dominant allele)", gx + gw2 - 150, gy2 + 18);
        ctx.fillStyle = "#42a5f5"; ctx.fillText("q (recessive allele)", gx + gw2 - 150, gy2 + 34);

        // Equation
        ctx.fillStyle = "#ccc"; ctx.font = "14px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`p\u00b2 + 2pq + q\u00b2 = 1  |  p = ${p.toFixed(2)}, q = ${q.toFixed(2)}`, W / 2, gy2 + gh2 + 20);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#ff9800">Hardy-Weinberg</b><br>` +
            `p: ${p.toFixed(2)} | q: ${q.toFixed(2)}<br>` +
            `AA: ${(pp * 100).toFixed(1)}%<br>` +
            `Aa: ${(pq2 * 100).toFixed(1)}%<br>` +
            `aa: ${(qq * 100).toFixed(1)}%`;
    }

    bindSlider("pfreq", "val-pfreq", () => { if (currentSim === "hardywein") { hwState.history = []; drawHardyWein(); } });
    bindSlider("hwPop", "val-hwPop", () => { if (currentSim === "hardywein") drawHardyWein(); });
    bindSlider("hwGens", "val-hwGens");

    document.getElementById("btn-hw-run").addEventListener("click", () => {
        const p0 = +document.getElementById("pfreq").value;
        const popSize = +document.getElementById("hwPop").value;
        const gens = +document.getElementById("hwGens").value;
        const drift = document.getElementById("hwDrift").checked;

        hwState.history = [{ p: p0, q: 1 - p0 }];
        let curP = p0;

        for (let g = 0; g < gens; g++) {
            if (drift) {
                // Simulate genetic drift via binomial sampling
                let pCount = 0;
                for (let i = 0; i < popSize * 2; i++) {
                    if (Math.random() < curP) pCount++;
                }
                curP = pCount / (popSize * 2);
            }
            // Without drift, p stays constant (HW equilibrium)
            hwState.history.push({ p: curP, q: 1 - curP });
        }
        drawHardyWein();
    });
    document.getElementById("btn-hw-reset").addEventListener("click", initHardyWein);

    // ═══════════════════════════════════════════════════════
    // 33. FOOD WEB / ENERGY FLOW
    // ═══════════════════════════════════════════════════════
    let fwState = { t: 0, running: false };

    function initFoodWeb() {
        fwState = { t: 0, running: false, particles: [] };
        drawFoodWeb();
    }

    function drawFoodWeb() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const sunE = +document.getElementById("sunEnergy").value;
        const eff = +document.getElementById("efficiency").value / 100;

        const levels = [
            { name: "Producers", sub: "Plants, Algae", energy: sunE, color: "#66bb6a", icon: "plant" },
            { name: "Primary Consumers", sub: "Herbivores", energy: sunE * eff, color: "#42a5f5", icon: "rabbit" },
            { name: "Secondary Consumers", sub: "Carnivores", energy: sunE * eff * eff, color: "#ff9800", icon: "fox" },
            { name: "Tertiary Consumers", sub: "Apex Predators", energy: sunE * eff * eff * eff, color: "#ef5350", icon: "eagle" },
            { name: "Decomposers", sub: "Bacteria, Fungi", energy: sunE * 0.15, color: "#78909c", icon: "mushroom" }
        ];

        if (fwState.running) {
            fwState.t += 0.02;
            // Energy flow particles
            if (Math.random() < 0.15) {
                const fromLevel = Math.floor(Math.random() * 3);
                fwState.particles.push({ from: fromLevel, progress: 0 });
            }
            fwState.particles.forEach(p => { p.progress += 0.01; });
            fwState.particles = fwState.particles.filter(p => p.progress < 1);
        }

        // Energy pyramid
        const pyrX = 50, pyrY = 50, pyrW = 400, pyrH = 380;
        const pyrLevels = 4; // excluding decomposers

        ctx.fillStyle = "#aab"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Energy Pyramid", pyrX + pyrW / 2, pyrY - 10);

        for (let i = 0; i < pyrLevels; i++) {
            const level = levels[i];
            const yPos = pyrY + pyrH - (i + 1) * (pyrH / pyrLevels);
            const width = pyrW * (1 - i * 0.22);
            const xPos = pyrX + (pyrW - width) / 2;
            const height = pyrH / pyrLevels - 8;

            // Bar with glow when animated
            const glow = fwState.running ? Math.sin(fwState.t * 2 + i) * 0.1 : 0;
            ctx.fillStyle = level.color;
            ctx.globalAlpha = 0.5 + glow;
            ctx.fillRect(xPos, yPos, width, height);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = level.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(xPos, yPos, width, height);

            // Label
            ctx.fillStyle = "#fff"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
            ctx.fillText(level.name, pyrX + pyrW / 2, yPos + height / 2 - 4);
            ctx.fillStyle = "#ddd"; ctx.font = "10px sans-serif";
            ctx.fillText(`${level.energy.toFixed(0)} kJ`, pyrX + pyrW / 2, yPos + height / 2 + 12);
            ctx.fillStyle = level.color; ctx.font = "9px sans-serif";
            ctx.fillText(level.sub, pyrX + pyrW / 2, yPos + height / 2 + 24);

            // Energy transfer arrows
            if (i < pyrLevels - 1 && fwState.running) {
                const arrowX = xPos + width + 10;
                ctx.beginPath();
                ctx.moveTo(arrowX, yPos + height / 2);
                ctx.lineTo(arrowX + 25, yPos + height / 2);
                ctx.lineTo(arrowX + 20, yPos + height / 2 - 5);
                ctx.moveTo(arrowX + 25, yPos + height / 2);
                ctx.lineTo(arrowX + 20, yPos + height / 2 + 5);
                ctx.strokeStyle = "rgba(255,255,255,0.3)";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = "rgba(255,152,0,0.6)"; ctx.font = "8px sans-serif"; ctx.textAlign = "left";
                ctx.fillText("Heat loss", arrowX + 5, yPos + height / 2 - 10);
                ctx.fillText(`${((1 - eff) * 100).toFixed(0)}%`, arrowX + 5, yPos + height / 2 + 20);
            }
        }

        // Decomposer bar at bottom
        const decY = pyrY + pyrH + 20;
        ctx.fillStyle = levels[4].color;
        ctx.globalAlpha = 0.4;
        ctx.fillRect(pyrX, decY, pyrW, 30);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = levels[4].color; ctx.lineWidth = 2;
        ctx.strokeRect(pyrX, decY, pyrW, 30);
        ctx.fillStyle = "#fff"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${levels[4].name} (${levels[4].sub}) — recycle nutrients`, pyrX + pyrW / 2, decY + 19);

        // Arrows from all levels to decomposers
        ctx.setLineDash([3, 3]);
        for (let i = 0; i < pyrLevels; i++) {
            const yPos = pyrY + pyrH - (i + 1) * (pyrH / pyrLevels) + pyrH / pyrLevels / 2;
            ctx.beginPath();
            ctx.moveTo(pyrX - 5, yPos);
            ctx.quadraticCurveTo(pyrX - 20, (yPos + decY + 15) / 2, pyrX + 20, decY + 15);
            ctx.strokeStyle = "rgba(120,144,156,0.3)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        ctx.setLineDash([]);

        // Food chain diagram on the right
        const chainX = pyrX + pyrW + 80, chainY = 70;
        ctx.fillStyle = "#aab"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Food Chain", chainX + 80, chainY - 15);

        const organisms = [
            { name: "Grass", emoji: "\u{1F33F}", y: chainY + 280 },
            { name: "Rabbit", emoji: "\u{1F407}", y: chainY + 200 },
            { name: "Fox", emoji: "\u{1F98A}", y: chainY + 120 },
            { name: "Eagle", emoji: "\u{1F985}", y: chainY + 40 }
        ];

        organisms.forEach((org, i) => {
            // Circle
            ctx.beginPath(); ctx.arc(chainX + 80, org.y, 28, 0, Math.PI * 2);
            ctx.fillStyle = levels[i].color; ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1;
            ctx.strokeStyle = levels[i].color; ctx.lineWidth = 2; ctx.stroke();

            ctx.font = "24px sans-serif"; ctx.textAlign = "center";
            ctx.fillText(org.emoji, chainX + 80, org.y + 8);
            ctx.fillStyle = levels[i].color; ctx.font = "10px sans-serif";
            ctx.fillText(org.name, chainX + 80, org.y + 42);

            // Arrow to next level
            if (i < organisms.length - 1) {
                const nextY = organisms[i + 1].y;
                ctx.beginPath();
                ctx.moveTo(chainX + 80, org.y - 30);
                ctx.lineTo(chainX + 80, nextY + 32);
                ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 2; ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(chainX + 80, nextY + 32);
                ctx.lineTo(chainX + 75, nextY + 40);
                ctx.lineTo(chainX + 85, nextY + 40);
                ctx.closePath();
                ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.fill();

                // Energy flowing particles
                if (fwState.running) {
                    fwState.particles.forEach(p => {
                        if (p.from === i) {
                            const py = org.y - 30 + (nextY + 32 - (org.y - 30)) * (1 - p.progress);
                            ctx.beginPath(); ctx.arc(chainX + 80, py, 3, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(255, 235, 59, ${1 - p.progress})`;
                            ctx.fill();
                        }
                    });
                }
            }
        });

        // 10% rule callout
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(chainX - 5, chainY + 340, 170, 50);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(chainX - 5, chainY + 340, 170, 50);
        ctx.fillStyle = "#ff9800"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${(eff * 100).toFixed(0)}% Rule`, chainX + 80, chainY + 360);
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif";
        ctx.fillText(`Only ${(eff * 100).toFixed(0)}% of energy transfers`, chainX + 80, chainY + 378);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#66bb6a">Food Web</b><br>` +
            `Sun: ${sunE} kJ<br>` +
            `Producers: ${levels[0].energy.toFixed(0)} kJ<br>` +
            `Herbivores: ${levels[1].energy.toFixed(0)} kJ<br>` +
            `Carnivores: ${levels[2].energy.toFixed(0)} kJ<br>` +
            `Apex: ${levels[3].energy.toFixed(0)} kJ`;

        if (fwState.running) {
            animId = requestAnimationFrame(drawFoodWeb);
        }
    }

    bindSlider("sunEnergy", "val-sunEnergy", () => { if (currentSim === "foodweb") drawFoodWeb(); });
    bindSlider("efficiency", "val-efficiency", () => { if (currentSim === "foodweb") drawFoodWeb(); });

    document.getElementById("btn-fw-animate").addEventListener("click", () => {
        fwState.running = !fwState.running;
        document.getElementById("btn-fw-animate").textContent = fwState.running ? "Pause" : "Animate";
        if (fwState.running) drawFoodWeb();
    });
    document.getElementById("btn-fw-reset").addEventListener("click", initFoodWeb);

    // ═══════════════════════════════════════════════════════
    // 34. CELL MEMBRANE TRANSPORT
    // ═══════════════════════════════════════════════════════
    let memState = {};

    function initMembrane() {
        memState = {
            t: 0, running: true, particles: [],
            insideConc: 50, outsideConc: 50,
            waterInside: 50, waterOutside: 50
        };
        resetMembraneParticles();
        document.getElementById("btn-mem-toggle").textContent = "Pause";
        drawMembrane();
    }

    function resetMembraneParticles() {
        const concType = document.getElementById("extConc").value;
        memState.particles = [];
        // Inside particles (solute)
        const insideCount = 30;
        const outsideCount = concType === "hypertonic" ? 60 : concType === "hypotonic" ? 10 : 30;
        memState.insideConc = insideCount;
        memState.outsideConc = outsideCount;

        for (let i = 0; i < insideCount; i++) {
            memState.particles.push({
                x: 220 + Math.random() * 260,
                y: 100 + Math.random() * 300,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                type: "solute", side: "inside"
            });
        }
        for (let i = 0; i < outsideCount; i++) {
            memState.particles.push({
                x: Math.random() < 0.5 ? 30 + Math.random() * 150 : 530 + Math.random() * 150,
                y: 80 + Math.random() * 340,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                type: "solute", side: "outside"
            });
        }
        // Water molecules
        for (let i = 0; i < 20; i++) {
            memState.particles.push({
                x: 240 + Math.random() * 220,
                y: 110 + Math.random() * 280,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                type: "water", side: "inside"
            });
        }
        for (let i = 0; i < 20; i++) {
            memState.particles.push({
                x: Math.random() < 0.5 ? 40 + Math.random() * 140 : 540 + Math.random() * 140,
                y: 90 + Math.random() * 320,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                type: "water", side: "outside"
            });
        }
    }

    function drawMembrane() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const concType = document.getElementById("extConc").value;
        const transport = document.getElementById("transportType").value;

        const cellLeft = 210, cellRight = 490, cellTop = 80, cellBot = 430;
        const cellCX = (cellLeft + cellRight) / 2, cellCY = (cellTop + cellBot) / 2;

        if (memState.running) {
            memState.t += 0.016;

            memState.particles.forEach(p => {
                // Random walk
                p.vx += (Math.random() - 0.5) * 0.3;
                p.vy += (Math.random() - 0.5) * 0.3;
                p.vx *= 0.97;
                p.vy *= 0.97;
                p.x += p.vx;
                p.y += p.vy;

                // Boundary checks
                if (p.side === "inside") {
                    if (p.x < cellLeft + 8) { p.x = cellLeft + 8; p.vx = Math.abs(p.vx); }
                    if (p.x > cellRight - 8) { p.x = cellRight - 8; p.vx = -Math.abs(p.vx); }
                    if (p.y < cellTop + 8) { p.y = cellTop + 8; p.vy = Math.abs(p.vy); }
                    if (p.y > cellBot - 8) { p.y = cellBot - 8; p.vy = -Math.abs(p.vy); }
                } else {
                    // Outside bounds
                    if (p.x < 15) { p.x = 15; p.vx = Math.abs(p.vx); }
                    if (p.x > W - 15) { p.x = W - 15; p.vx = -Math.abs(p.vx); }
                    if (p.y < 60) { p.y = 60; p.vy = Math.abs(p.vy); }
                    if (p.y > H - 60) { p.y = H - 60; p.vy = -Math.abs(p.vy); }
                    // Bounce off cell membrane from outside
                    if (p.x > cellLeft + 5 && p.x < cellRight - 5 && p.y > cellTop + 5 && p.y < cellBot - 5) {
                        // Transport across membrane
                        if (transport === "osmosis" && p.type === "water") {
                            p.side = "inside";
                        } else if (transport === "passive" && Math.random() < 0.02) {
                            p.side = "inside";
                        } else if (transport === "active" && Math.random() < 0.03) {
                            p.side = "inside";
                        } else {
                            // Bounce
                            const dLeft = p.x - cellLeft, dRight = cellRight - p.x;
                            const dTop = p.y - cellTop, dBot = cellBot - p.y;
                            const minD = Math.min(dLeft, dRight, dTop, dBot);
                            if (minD === dLeft) { p.x = cellLeft - 2; p.vx = -Math.abs(p.vx); }
                            else if (minD === dRight) { p.x = cellRight + 2; p.vx = Math.abs(p.vx); }
                            else if (minD === dTop) { p.y = cellTop - 2; p.vy = -Math.abs(p.vy); }
                            else { p.y = cellBot + 2; p.vy = Math.abs(p.vy); }
                        }
                    }
                }

                // Osmosis: water moves to higher solute concentration
                if (transport === "osmosis" && p.type === "water" && p.side === "inside") {
                    if (concType === "hypertonic" && Math.random() < 0.005) {
                        // Water leaves cell (hypertonic: more solute outside)
                        p.side = "outside";
                        p.x = Math.random() < 0.5 ? cellLeft - 20 : cellRight + 20;
                    } else if (concType === "hypotonic" && Math.random() < 0.001) {
                        // Water stays inside mostly (hypotonic: less solute outside)
                    }
                }
                if (transport === "osmosis" && p.type === "water" && p.side === "outside") {
                    if (concType === "hypotonic" && Math.random() < 0.008) {
                        p.side = "inside";
                        p.x = cellLeft + 20 + Math.random() * (cellRight - cellLeft - 40);
                        p.y = cellTop + 20 + Math.random() * (cellBot - cellTop - 40);
                    }
                }

                // Active transport: pump solute against gradient
                if (transport === "active" && p.type === "solute" && p.side === "outside") {
                    if (Math.random() < 0.003) {
                        p.side = "inside";
                        p.x = cellLeft + 30 + Math.random() * (cellRight - cellLeft - 60);
                        p.y = cellTop + 30 + Math.random() * (cellBot - cellTop - 60);
                    }
                }
            });
        }

        // Extracellular fluid
        ctx.fillStyle = concType === "hypertonic" ? "rgba(30, 60, 90, 0.3)" :
                         concType === "hypotonic" ? "rgba(30, 90, 60, 0.15)" :
                         "rgba(40, 40, 80, 0.2)";
        ctx.fillRect(10, 55, W - 20, H - 90);

        // Cell membrane (phospholipid bilayer)
        const cellW = cellRight - cellLeft;
        const cellH = cellBot - cellTop;

        // Cell shape with slight bulge based on osmosis
        const waterIn = memState.particles.filter(p => p.type === "water" && p.side === "inside").length;
        const bulge = transport === "osmosis" ? (waterIn - 20) * 0.5 : 0;

        ctx.beginPath();
        ctx.ellipse(cellCX, cellCY, cellW / 2 + bulge, cellH / 2 + bulge * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 230, 200, 0.05)";
        ctx.fill();

        // Membrane bilayer visualization
        const numPhospholipids = 40;
        for (let i = 0; i < numPhospholipids; i++) {
            const angle = (i / numPhospholipids) * Math.PI * 2;
            const rx = cellW / 2 + bulge;
            const ry = cellH / 2 + bulge * 0.5;
            const mx = cellCX + rx * Math.cos(angle);
            const my = cellCY + ry * Math.sin(angle);
            const nx = Math.cos(angle);
            const ny = Math.sin(angle);

            // Outer head (hydrophilic)
            ctx.beginPath(); ctx.arc(mx + nx * 3, my + ny * 3, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#42a5f5"; ctx.fill();
            // Inner head
            ctx.beginPath(); ctx.arc(mx - nx * 3, my - ny * 3, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#42a5f5"; ctx.fill();
            // Tails
            ctx.beginPath();
            ctx.moveTo(mx + nx * 1, my + ny * 1);
            ctx.lineTo(mx - nx * 1, my - ny * 1);
            ctx.strokeStyle = "rgba(255, 235, 59, 0.4)";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Channel proteins (gaps in membrane)
        if (transport === "passive" || transport === "active") {
            const channels = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
            channels.forEach(angle => {
                const rx = cellW / 2 + bulge;
                const ry = cellH / 2 + bulge * 0.5;
                const cx2 = cellCX + rx * Math.cos(angle);
                const cy2 = cellCY + ry * Math.sin(angle);
                ctx.beginPath(); ctx.arc(cx2, cy2, 8, 0, Math.PI * 2);
                ctx.fillStyle = transport === "active" ? "rgba(156, 39, 176, 0.5)" : "rgba(76, 175, 80, 0.4)";
                ctx.fill();
                ctx.strokeStyle = transport === "active" ? "#9c27b0" : "#66bb6a";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            });
        }

        // ATP indicator for active transport
        if (transport === "active") {
            ctx.fillStyle = "#ffeb3b"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("ATP", cellCX, cellTop - 15);
            ctx.fillText("\u26a1", cellCX + 25, cellTop - 12);
        }

        // Draw particles
        memState.particles.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.type === "solute" ? 4 : 3, 0, Math.PI * 2);
            if (p.type === "solute") {
                ctx.fillStyle = p.side === "inside" ? "#ff9800" : "#ef5350";
            } else {
                ctx.fillStyle = "rgba(100, 180, 255, 0.6)";
            }
            ctx.fill();
        });

        // Labels
        ctx.font = "13px sans-serif"; ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText("Intracellular", cellCX, cellCY);
        ctx.fillText("Extracellular", 110, 75);
        ctx.fillText("Extracellular", W - 110, 75);

        // Concentration labels
        const insideSolute = memState.particles.filter(p => p.type === "solute" && p.side === "inside").length;
        const outsideSolute = memState.particles.filter(p => p.type === "solute" && p.side === "outside").length;

        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(20, H - 70, W - 40, 55);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(20, H - 70, W - 40, 55);

        ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = "#ff9800"; ctx.fillText(`Inside solute: ${insideSolute}`, 35, H - 50);
        ctx.fillStyle = "#ef5350"; ctx.fillText(`Outside solute: ${outsideSolute}`, 200, H - 50);
        ctx.fillStyle = "#64b5f6"; ctx.fillText(`Inside water: ${memState.particles.filter(p => p.type === "water" && p.side === "inside").length}`, 380, H - 50);
        ctx.fillStyle = "#42a5f5"; ctx.fillText(`Outside water: ${memState.particles.filter(p => p.type === "water" && p.side === "outside").length}`, 540, H - 50);

        ctx.fillStyle = "#ccc"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        const label = concType === "hypertonic" ? "Hypertonic (cell shrinks - crenation)" :
                      concType === "hypotonic" ? "Hypotonic (cell swells - lysis risk)" :
                      "Isotonic (equilibrium)";
        ctx.fillText(`Environment: ${label}`, W / 2, H - 28);

        // Legend
        ctx.textAlign = "left"; ctx.font = "10px sans-serif";
        ctx.fillStyle = "#42a5f5"; ctx.fillText("\u25cf Phospholipid heads", 35, H - 78);
        ctx.fillStyle = "#ff9800"; ctx.fillText("\u25cf Solute (inside)", 200, H - 78);
        ctx.fillStyle = "#ef5350"; ctx.fillText("\u25cf Solute (outside)", 340, H - 78);
        ctx.fillStyle = "#64b5f6"; ctx.fillText("\u25cf Water", 500, H - 78);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#42a5f5">Membrane Transport</b><br>` +
            `Type: ${transport}<br>` +
            `Env: ${concType}<br>` +
            `Inside: ${insideSolute} solute<br>` +
            `Outside: ${outsideSolute} solute`;

        if (memState.running) {
            animId = requestAnimationFrame(drawMembrane);
        }
    }

    document.getElementById("extConc").addEventListener("change", () => {
        if (currentSim === "membrane") { resetMembraneParticles(); }
    });
    document.getElementById("transportType").addEventListener("change", () => {
        if (currentSim === "membrane") { resetMembraneParticles(); }
    });

    document.getElementById("btn-mem-toggle").addEventListener("click", () => {
        memState.running = !memState.running;
        document.getElementById("btn-mem-toggle").textContent = memState.running ? "Pause" : "Resume";
        if (memState.running) drawMembrane();
    });
    document.getElementById("btn-mem-reset").addEventListener("click", initMembrane);

    // ═══════════════════════════════════════════════════════
    // 35. CELLULAR RESPIRATION
    // ═══════════════════════════════════════════════════════
    let respState = {};

    function initRespiration() {
        respState = { t: 0, running: false, phase: 0, progress: 0,
            glycolysis: { atp: 0, nadh: 0, pyruvate: 0 },
            krebs: { atp: 0, nadh: 0, fadh2: 0, co2: 0 },
            etc: { atp: 0, h2o: 0 },
            totalATP: 0
        };
        drawRespiration();
    }

    const respPhases = [
        { name: "Glycolysis", loc: "Cytoplasm", color: "#ff9800" },
        { name: "Pyruvate Oxidation", loc: "Mitochondrial Matrix", color: "#ff7043" },
        { name: "Krebs Cycle", loc: "Mitochondrial Matrix", color: "#66bb6a" },
        { name: "Electron Transport Chain", loc: "Inner Membrane", color: "#42a5f5" }
    ];

    function drawRespiration() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const glucose = +document.getElementById("glucoseIn").value;
        const o2 = +document.getElementById("o2avail").value / 100;

        if (respState.running) {
            respState.t += 0.016;
            respState.progress += 0.004;

            if (respState.progress >= 1) {
                respState.progress = 0;
                respState.phase++;
                if (respState.phase >= respPhases.length) {
                    respState.phase = respPhases.length - 1;
                    respState.progress = 1;
                    respState.running = false;
                }
            }

            // Accumulate outputs
            const p = respState.phase;
            if (p === 0) {
                respState.glycolysis.atp = Math.floor(respState.progress * 2 * glucose);
                respState.glycolysis.nadh = Math.floor(respState.progress * 2 * glucose);
                respState.glycolysis.pyruvate = Math.floor(respState.progress * 2 * glucose);
            } else if (p === 1) {
                respState.glycolysis = { atp: 2 * glucose, nadh: 2 * glucose, pyruvate: 2 * glucose };
            } else if (p === 2) {
                respState.krebs.atp = Math.floor(respState.progress * 2 * glucose);
                respState.krebs.nadh = Math.floor(respState.progress * 6 * glucose);
                respState.krebs.fadh2 = Math.floor(respState.progress * 2 * glucose);
                respState.krebs.co2 = Math.floor(respState.progress * 4 * glucose);
            } else if (p === 3) {
                respState.krebs = { atp: 2 * glucose, nadh: 6 * glucose, fadh2: 2 * glucose, co2: 4 * glucose };
                respState.etc.atp = Math.floor(respState.progress * 34 * glucose * o2);
                respState.etc.h2o = Math.floor(respState.progress * 6 * glucose * o2);
            }

            respState.totalATP = respState.glycolysis.atp + respState.krebs.atp + respState.etc.atp;
        }

        // Mitochondrion shape
        const mx = W / 2, my = 200;
        ctx.beginPath();
        ctx.ellipse(mx, my, 280, 110, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(38, 50, 56, 0.4)";
        ctx.fill();
        ctx.strokeStyle = "#546e7a";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner membrane (cristae)
        ctx.beginPath();
        ctx.ellipse(mx, my, 230, 80, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "#78909c";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Cristae folds
        for (let i = 0; i < 5; i++) {
            const cx2 = mx - 150 + i * 75;
            ctx.beginPath();
            ctx.moveTo(cx2, my + 60);
            ctx.quadraticCurveTo(cx2 + 15, my + 20, cx2 + 30, my + 60);
            ctx.strokeStyle = "rgba(120, 144, 156, 0.5)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Labels
        ctx.fillStyle = "#78909c"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Outer Membrane", mx, my - 115);
        ctx.fillText("Inner Membrane", mx, my - 85);
        ctx.fillText("Matrix", mx, my + 5);

        // Stage boxes
        const stages = [
            { x: 40, y: 340, w: 180, h: 150, phase: 0,
              inputs: [`${glucose} Glucose`], outputs: [`${respState.glycolysis.atp} ATP`, `${respState.glycolysis.nadh} NADH`, `${respState.glycolysis.pyruvate} Pyruvate`] },
            { x: 240, y: 340, w: 140, h: 150, phase: 1,
              inputs: ["Pyruvate"], outputs: ["Acetyl-CoA", "CO\u2082", "NADH"] },
            { x: 400, y: 340, w: 180, h: 150, phase: 2,
              inputs: ["Acetyl-CoA"], outputs: [`${respState.krebs.atp} ATP`, `${respState.krebs.nadh} NADH`, `${respState.krebs.fadh2} FADH\u2082`, `${respState.krebs.co2} CO\u2082`] },
            { x: 610, y: 340, w: 200, h: 150, phase: 3,
              inputs: ["NADH", "FADH\u2082", "O\u2082"], outputs: [`${respState.etc.atp} ATP`, `${respState.etc.h2o} H\u2082O`] }
        ];

        stages.forEach(s => {
            const isActive = respState.phase === s.phase;
            const isDone = respState.phase > s.phase;
            ctx.fillStyle = isActive ? "rgba(16,20,58,0.9)" : "rgba(16,20,58,0.5)";
            ctx.fillRect(s.x, s.y, s.w, s.h);
            ctx.strokeStyle = isActive ? respPhases[s.phase].color : isDone ? "rgba(76,175,80,0.4)" : "#333";
            ctx.lineWidth = isActive ? 2 : 1;
            ctx.strokeRect(s.x, s.y, s.w, s.h);

            // Progress bar
            if (isActive) {
                ctx.fillStyle = respPhases[s.phase].color;
                ctx.globalAlpha = 0.3;
                ctx.fillRect(s.x + 1, s.y + s.h - 4, (s.w - 2) * respState.progress, 3);
                ctx.globalAlpha = 1;
            }

            ctx.fillStyle = respPhases[s.phase].color;
            ctx.font = "bold 11px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(respPhases[s.phase].name, s.x + s.w / 2, s.y + 18);

            ctx.fillStyle = "#667"; ctx.font = "9px sans-serif";
            ctx.fillText(respPhases[s.phase].loc, s.x + s.w / 2, s.y + 32);

            // Inputs
            ctx.fillStyle = "#ef9a9a"; ctx.font = "9px sans-serif"; ctx.textAlign = "left";
            ctx.fillText("In:", s.x + 8, s.y + 50);
            s.inputs.forEach((inp, i) => {
                ctx.fillStyle = "#ef9a9a";
                ctx.fillText(inp, s.x + 25, s.y + 50 + i * 12);
            });

            // Outputs
            const outY = s.y + 50 + s.inputs.length * 12 + 8;
            ctx.fillStyle = "#a5d6a7"; ctx.fillText("Out:", s.x + 8, outY);
            s.outputs.forEach((out, i) => {
                ctx.fillStyle = "#a5d6a7";
                ctx.fillText(out, s.x + 25, outY + i * 12);
            });

            // Arrows between stages
            if (s.phase < 3) {
                ctx.beginPath();
                ctx.moveTo(s.x + s.w + 2, s.y + s.h / 2);
                ctx.lineTo(s.x + s.w + 15, s.y + s.h / 2);
                ctx.strokeStyle = "rgba(255,255,255,0.2)";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(s.x + s.w + 15, s.y + s.h / 2);
                ctx.lineTo(s.x + s.w + 10, s.y + s.h / 2 - 4);
                ctx.lineTo(s.x + s.w + 10, s.y + s.h / 2 + 4);
                ctx.closePath();
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                ctx.fill();
            }
        });

        // Total ATP counter
        const maxATP = (2 + 2 + 34) * glucose;
        ctx.fillStyle = "rgba(16,20,58,0.9)";
        ctx.fillRect(W / 2 - 120, my + 25, 240, 55);
        ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 2;
        ctx.strokeRect(W / 2 - 120, my + 25, 240, 55);

        ctx.fillStyle = "#ffeb3b"; ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`Total ATP: ${respState.totalATP} / ${maxATP}`, mx, my + 50);
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif";
        ctx.fillText(`C\u2086H\u2081\u2082O\u2086 + 6O\u2082 \u2192 6CO\u2082 + 6H\u2082O + ATP`, mx, my + 68);

        // Equation at bottom
        ctx.fillStyle = o2 < 0.5 ? "#ff9800" : "#ccc";
        ctx.font = "12px sans-serif";
        ctx.fillText(o2 < 0.5 ? "Low O\u2082: Fermentation pathway (less ATP)" : "Aerobic respiration (full ATP yield)", mx, H - 10);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#ff9800">Cell Respiration</b><br>` +
            `Phase: ${respPhases[respState.phase].name}<br>` +
            `Total ATP: ${respState.totalATP}<br>` +
            `O\u2082: ${(o2 * 100).toFixed(0)}%`;

        if (respState.running) {
            animId = requestAnimationFrame(drawRespiration);
        }
    }

    bindSlider("glucoseIn", "val-glucoseIn", () => { if (!respState.running) drawRespiration(); });
    bindSlider("o2avail", "val-o2avail", () => { if (!respState.running) drawRespiration(); });

    document.getElementById("btn-resp-start").addEventListener("click", () => {
        respState = { t: 0, running: true, phase: 0, progress: 0,
            glycolysis: { atp: 0, nadh: 0, pyruvate: 0 },
            krebs: { atp: 0, nadh: 0, fadh2: 0, co2: 0 },
            etc: { atp: 0, h2o: 0 }, totalATP: 0 };
        drawRespiration();
    });
    document.getElementById("btn-resp-reset").addEventListener("click", initRespiration);

    // ═══════════════════════════════════════════════════════
    // 36. MAGNETIC FIELD
    // ═══════════════════════════════════════════════════════

    function initMagField() {
        drawMagField();
    }

    function drawMagField() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const current = +document.getElementById("current").value;
        const mode = document.getElementById("magMode").value;
        const showCompass = document.getElementById("showCompass").checked;
        const cx = W / 2, cy = H / 2;

        if (mode === "wire") {
            // Straight wire coming out of screen
            ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2);
            ctx.fillStyle = "#78909c"; ctx.fill();
            ctx.strokeStyle = "#b0bec5"; ctx.lineWidth = 2; ctx.stroke();
            // Current direction dot (out of screen)
            ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#ffeb3b"; ctx.fill();
            ctx.fillStyle = "#ffeb3b"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("I (out)", cx, cy + 30);

            // Concentric field lines
            const numRings = 8;
            for (let i = 1; i <= numRings; i++) {
                const r = 30 + i * 28;
                const strength = current / r * 50;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(100, 180, 255, ${Math.min(0.5, strength * 0.15)})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Direction arrows on the rings
                for (let a = 0; a < 4; a++) {
                    const angle = (a / 4) * Math.PI * 2;
                    const ax = cx + r * Math.cos(angle);
                    const ay = cy + r * Math.sin(angle);
                    const tangent = angle + Math.PI / 2; // CCW for current out
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(ax + 8 * Math.cos(tangent), ay + 8 * Math.sin(tangent));
                    ctx.lineTo(ax + 4 * Math.cos(tangent - 0.4) - 3 * Math.sin(tangent - 0.4),
                               ay + 4 * Math.sin(tangent - 0.4) + 3 * Math.cos(tangent - 0.4));
                    ctx.strokeStyle = `rgba(100, 180, 255, ${Math.min(0.7, strength * 0.25)})`;
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }

            // Compass needles
            if (showCompass) {
                const gridSpacing = 50;
                for (let gx = 40; gx < W - 40; gx += gridSpacing) {
                    for (let gy = 40; gy < H - 40; gy += gridSpacing) {
                        const dx = gx - cx, dy = gy - cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 30 || dist > 250) continue;
                        // B field direction: tangential (CCW)
                        const angle = Math.atan2(dy, dx) + Math.PI / 2;
                        const strength2 = Math.min(1, current / dist * 20);

                        ctx.save();
                        ctx.translate(gx, gy);
                        ctx.rotate(angle);
                        // Needle
                        ctx.beginPath();
                        ctx.moveTo(-8, 0); ctx.lineTo(8, 0);
                        ctx.strokeStyle = `rgba(239, 83, 80, ${strength2})`;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        // North tip
                        ctx.beginPath();
                        ctx.moveTo(8, 0); ctx.lineTo(5, -2); ctx.lineTo(5, 2); ctx.closePath();
                        ctx.fillStyle = `rgba(239, 83, 80, ${strength2})`;
                        ctx.fill();
                        ctx.restore();
                    }
                }
            }

            // Right-hand rule hint
            ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Right-Hand Rule: Thumb \u2192 Current, Fingers \u2192 B field (CCW)", cx, H - 20);

        } else if (mode === "solenoid") {
            // Solenoid (side view)
            const solW = 400, solH = 100;
            const solX = cx - solW / 2, solY = cy - solH / 2;

            // Coils
            const numCoils = 12;
            for (let i = 0; i < numCoils; i++) {
                const coilX = solX + (i + 0.5) * (solW / numCoils);
                ctx.beginPath();
                ctx.ellipse(coilX, cy, 8, solH / 2 + 10, 0, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 152, 0, ${0.4 + Math.sin(i * 0.5) * 0.1})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }

            // Internal field lines (straight, parallel)
            const numInternalLines = 5;
            for (let i = 0; i < numInternalLines; i++) {
                const ly = cy - solH / 3 + (i / (numInternalLines - 1)) * (solH * 2 / 3);
                ctx.beginPath();
                ctx.moveTo(solX - 20, ly);
                ctx.lineTo(solX + solW + 20, ly);
                ctx.strokeStyle = `rgba(100, 180, 255, ${0.3 + current * 0.03})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                // Arrow
                ctx.beginPath();
                ctx.moveTo(cx + 30, ly);
                ctx.lineTo(cx + 22, ly - 3);
                ctx.lineTo(cx + 22, ly + 3);
                ctx.closePath();
                ctx.fillStyle = `rgba(100, 180, 255, 0.5)`;
                ctx.fill();
            }

            // External return field lines (curved)
            [-1, 1].forEach(sign => {
                ctx.beginPath();
                ctx.moveTo(solX + solW + 20, cy + sign * 10);
                ctx.bezierCurveTo(solX + solW + 120, cy + sign * 150,
                                   solX - 120, cy + sign * 150,
                                   solX - 20, cy + sign * 10);
                ctx.strokeStyle = "rgba(100, 180, 255, 0.15)";
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // N and S poles
            ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
            ctx.fillStyle = "#ef5350"; ctx.fillText("N", solX + solW + 35, cy + 6);
            ctx.fillStyle = "#42a5f5"; ctx.fillText("S", solX - 35, cy + 6);

            // Current direction labels
            ctx.fillStyle = "#ff9800"; ctx.font = "10px sans-serif";
            ctx.fillText("I \u2192", solX + solW / 2, solY - 20);

            // B field label
            ctx.fillStyle = "#42a5f5"; ctx.font = "12px sans-serif";
            ctx.fillText("B = \u03bc\u2080nI", cx, cy + solH / 2 + 40);
            ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif";
            ctx.fillText(`B \u221d I = ${current.toFixed(1)} A`, cx, cy + solH / 2 + 56);

            // Compass needles outside
            if (showCompass) {
                for (let gx2 = 80; gx2 < W - 80; gx2 += 60) {
                    for (let gy2 = 40; gy2 < H - 40; gy2 += 60) {
                        if (gx2 > solX - 15 && gx2 < solX + solW + 15 &&
                            gy2 > solY - 15 && gy2 < solY + solH + 15) continue;
                        const dx = gx2 - cx, dy = gy2 - cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        // Approximate field direction
                        let angle;
                        if (gx2 > solX + solW) angle = Math.atan2(dy, dx - solW / 2);
                        else if (gx2 < solX) angle = Math.atan2(dy, dx + solW / 2) + Math.PI;
                        else angle = 0;

                        ctx.save();
                        ctx.translate(gx2, gy2);
                        ctx.rotate(angle);
                        ctx.beginPath();
                        ctx.moveTo(-7, 0); ctx.lineTo(7, 0);
                        ctx.strokeStyle = "rgba(239, 83, 80, 0.4)";
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(7, 0); ctx.lineTo(4, -2); ctx.lineTo(4, 2); ctx.closePath();
                        ctx.fillStyle = "rgba(239, 83, 80, 0.4)"; ctx.fill();
                        ctx.restore();
                    }
                }
            }

        } else if (mode === "loop") {
            // Current loop (top view)
            const loopR = 120;
            ctx.beginPath(); ctx.arc(cx, cy, loopR, 0, Math.PI * 2);
            ctx.strokeStyle = "#ff9800"; ctx.lineWidth = 4; ctx.stroke();

            // Current direction arrows
            for (let a = 0; a < 6; a++) {
                const angle = (a / 6) * Math.PI * 2;
                const ax = cx + loopR * Math.cos(angle);
                const ay = cy + loopR * Math.sin(angle);
                const tangent = angle + Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(ax + 10 * Math.cos(tangent), ay + 10 * Math.sin(tangent));
                ctx.lineTo(ax + 5 * Math.cos(tangent - 0.5), ay + 5 * Math.sin(tangent - 0.5));
                ctx.lineTo(ax + 5 * Math.cos(tangent + 0.5), ay + 5 * Math.sin(tangent + 0.5));
                ctx.closePath();
                ctx.fillStyle = "#ff9800"; ctx.fill();
            }

            // Field lines through center (up)
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.moveTo(cx + i * 15, cy + 200);
                ctx.quadraticCurveTo(cx + i * 15, cy, cx + i * 15, cy - 200);
                ctx.strokeStyle = `rgba(100, 180, 255, ${0.3 - Math.abs(i) * 0.05})`;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                // Arrow
                ctx.beginPath();
                ctx.moveTo(cx + i * 15, cy - 50);
                ctx.lineTo(cx + i * 15 - 3, cy - 42);
                ctx.lineTo(cx + i * 15 + 3, cy - 42);
                ctx.closePath();
                ctx.fillStyle = "rgba(100, 180, 255, 0.4)"; ctx.fill();
            }

            // External return lines
            [-1, 1].forEach(sign => {
                ctx.beginPath();
                ctx.moveTo(cx + sign * 30, cy - 200);
                ctx.bezierCurveTo(cx + sign * 250, cy - 200,
                                   cx + sign * 250, cy + 200,
                                   cx + sign * 30, cy + 200);
                ctx.strokeStyle = "rgba(100, 180, 255, 0.1)";
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            ctx.fillStyle = "#42a5f5"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("B (through loop center)", cx, cy - 10);
            ctx.fillStyle = "#ff9800";
            ctx.fillText("Current loop (I)", cx, cy + loopR + 25);
        }

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#42a5f5">Magnetic Field</b><br>` +
            `Mode: ${mode}<br>` +
            `I: ${current} A<br>` +
            `B \u221d ${mode === "wire" ? "\u03bc\u2080I/2\u03c0r" : "\u03bc\u2080nI"}`;
    }

    bindSlider("current", "val-current", () => { if (currentSim === "magfield") drawMagField(); });
    document.getElementById("magMode").addEventListener("change", () => { if (currentSim === "magfield") drawMagField(); });
    document.getElementById("showCompass").addEventListener("change", () => { if (currentSim === "magfield") drawMagField(); });
    document.getElementById("btn-mag-reset").addEventListener("click", initMagField);

    // ═══════════════════════════════════════════════════════
    // 37. CHEMICAL EQUILIBRIUM (LE CHATELIER)
    // ═══════════════════════════════════════════════════════
    let eqState = {};

    function initChemEq() {
        eqState = { A: 80, B: 20, running: true, t: 0, history: [] };
        document.getElementById("btn-eq-toggle").textContent = "Pause";
        drawChemEq();
    }

    function drawChemEq() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const kf = +document.getElementById("kf").value;
        const kr = +document.getElementById("kr").value;

        if (eqState.running) {
            eqState.t += 0.016;
            // A ⇌ B reaction
            const forward = kf * eqState.A;
            const reverse = kr * eqState.B;
            eqState.A += (-forward + reverse) * 0.5;
            eqState.B += (forward - reverse) * 0.5;
            eqState.A = Math.max(0, eqState.A);
            eqState.B = Math.max(0, eqState.B);

            if (eqState.history.length === 0 || eqState.t - eqState.history[eqState.history.length - 1].t > 0.05) {
                eqState.history.push({ t: eqState.t, A: eqState.A, B: eqState.B });
                if (eqState.history.length > 500) eqState.history.shift();
            }
        }

        // Beaker visualization
        const beakerX = 60, beakerY = 50, beakerW = 280, beakerH = 250;

        // Beaker outline
        ctx.beginPath();
        ctx.moveTo(beakerX, beakerY);
        ctx.lineTo(beakerX, beakerY + beakerH);
        ctx.lineTo(beakerX + beakerW, beakerY + beakerH);
        ctx.lineTo(beakerX + beakerW, beakerY);
        ctx.strokeStyle = "rgba(200,200,220,0.5)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Liquid level
        const total = eqState.A + eqState.B;
        const fillH = beakerH * 0.85;
        const ratioA = eqState.A / total;
        const ratioB = eqState.B / total;

        // Mixed color
        const r = Math.round(239 * ratioA + 66 * ratioB);
        const g = Math.round(83 * ratioA + 187 * ratioB);
        const b = Math.round(80 * ratioA + 106 * ratioB);
        ctx.fillStyle = `rgba(${r},${g},${b},0.4)`;
        ctx.fillRect(beakerX + 3, beakerY + beakerH - fillH, beakerW - 6, fillH - 3);

        // Particles in beaker
        const numDotsA = Math.min(40, Math.round(eqState.A / 2));
        const numDotsB = Math.min(40, Math.round(eqState.B / 2));

        for (let i = 0; i < numDotsA; i++) {
            const px = beakerX + 15 + (i % 8) * 32;
            const py = beakerY + beakerH - 20 - Math.floor(i / 8) * 20 + Math.sin(eqState.t * 2 + i) * 3;
            ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#ef5350"; ctx.fill();
        }
        for (let i = 0; i < numDotsB; i++) {
            const px = beakerX + 25 + (i % 8) * 32;
            const py = beakerY + beakerH - 30 - Math.floor(i / 8) * 20 + Math.cos(eqState.t * 2 + i) * 3;
            ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#42a5f5"; ctx.fill();
        }

        // Legend
        ctx.fillStyle = "#ef5350"; ctx.font = "13px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`A (Reactant): ${eqState.A.toFixed(1)}`, beakerX, beakerY + beakerH + 25);
        ctx.fillStyle = "#42a5f5";
        ctx.fillText(`B (Product): ${eqState.B.toFixed(1)}`, beakerX, beakerY + beakerH + 45);

        // Reaction equation
        ctx.fillStyle = "#ccc"; ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("A \u21cc B", beakerX + beakerW / 2, beakerY - 12);

        // Equilibrium constant
        const Keq = eqState.B / Math.max(0.1, eqState.A);
        const theoretical = kf / kr;
        ctx.fillStyle = "#ffeb3b"; ctx.font = "12px sans-serif";
        ctx.fillText(`K_eq = [B]/[A] = ${Keq.toFixed(2)}`, beakerX + beakerW / 2, beakerY + beakerH + 65);
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif";
        ctx.fillText(`Theoretical K = k\u2081/k\u2082 = ${theoretical.toFixed(2)}`, beakerX + beakerW / 2, beakerY + beakerH + 82);

        // Rate bars
        const rateX = beakerX, rateY = beakerY + beakerH + 95, rateW = beakerW, rateH = 50;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(rateX, rateY, rateW, rateH);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(rateX, rateY, rateW, rateH);

        const fwdRate = kf * eqState.A;
        const revRate = kr * eqState.B;
        const maxRate = Math.max(fwdRate, revRate, 1);

        ctx.fillStyle = "#ef5350";
        ctx.fillRect(rateX + 5, rateY + 8, (fwdRate / maxRate) * (rateW - 10) * 0.4, 12);
        ctx.fillStyle = "#ef9a9a"; ctx.font = "9px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`Forward: ${fwdRate.toFixed(1)}`, rateX + 10, rateY + 17);

        ctx.fillStyle = "#42a5f5";
        ctx.fillRect(rateX + 5, rateY + 28, (revRate / maxRate) * (rateW - 10) * 0.4, 12);
        ctx.fillStyle = "#90caf9";
        ctx.fillText(`Reverse: ${revRate.toFixed(1)}`, rateX + 10, rateY + 37);

        // At equilibrium indicator
        if (Math.abs(fwdRate - revRate) < 0.5) {
            ctx.fillStyle = "#4caf50"; ctx.font = "bold 10px sans-serif";
            ctx.fillText("\u2713 At Equilibrium", rateX + rateW - 100, rateY + 25);
        }

        // Concentration vs Time graph
        const gx = 380, gy = 50, gw = W - 410, gh = H - 90;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(gx, gy, gw, gh);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Concentration vs Time", gx + 8, gy - 6);

        if (eqState.history.length > 1) {
            const tMin = eqState.history[0].t;
            const tMax = eqState.history[eqState.history.length - 1].t;
            const tRange = Math.max(0.1, tMax - tMin);
            let maxVal = 1;
            eqState.history.forEach(h => { maxVal = Math.max(maxVal, h.A, h.B); });

            // A line
            ctx.beginPath();
            eqState.history.forEach((h, i) => {
                const px = gx + ((h.t - tMin) / tRange) * gw;
                const py = gy + gh - (h.A / maxVal) * gh * 0.9;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#ef5350"; ctx.lineWidth = 2; ctx.stroke();

            // B line
            ctx.beginPath();
            eqState.history.forEach((h, i) => {
                const px = gx + ((h.t - tMin) / tRange) * gw;
                const py = gy + gh - (h.B / maxVal) * gh * 0.9;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#42a5f5"; ctx.lineWidth = 2; ctx.stroke();
        }

        ctx.fillStyle = "#ef5350"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("[A] Reactant", gx + gw - 100, gy + 16);
        ctx.fillStyle = "#42a5f5";
        ctx.fillText("[B] Product", gx + gw - 100, gy + 30);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#ff9800">Chemical Equilibrium</b><br>` +
            `[A]: ${eqState.A.toFixed(1)}<br>` +
            `[B]: ${eqState.B.toFixed(1)}<br>` +
            `K_eq: ${Keq.toFixed(2)}`;

        if (eqState.running) {
            animId = requestAnimationFrame(drawChemEq);
        }
    }

    bindSlider("kf", "val-kf");
    bindSlider("kr", "val-kr");

    document.getElementById("btn-eq-addA").addEventListener("click", () => {
        eqState.A += 30;
    });
    document.getElementById("btn-eq-addB").addEventListener("click", () => {
        eqState.B += 30;
    });
    document.getElementById("btn-eq-toggle").addEventListener("click", () => {
        eqState.running = !eqState.running;
        document.getElementById("btn-eq-toggle").textContent = eqState.running ? "Pause" : "Resume";
        if (eqState.running) drawChemEq();
    });
    document.getElementById("btn-eq-reset").addEventListener("click", initChemEq);

    // ═══════════════════════════════════════════════════════
    // 38. SIR EPIDEMIC MODEL
    // ═══════════════════════════════════════════════════════
    let sirState = {};

    function initEpidemic() {
        const pop = +document.getElementById("sirPop").value;
        const people = [];
        const W = canvas.width, H2 = 280;
        for (let i = 0; i < pop; i++) {
            people.push({
                x: 30 + Math.random() * (W - 60),
                y: 30 + Math.random() * H2,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                state: i === 0 ? "I" : "S", // patient zero
                infectedAt: i === 0 ? 0 : -1
            });
        }
        sirState = { people, t: 0, running: true, history: [] };
        document.getElementById("btn-sir-toggle").textContent = "Pause";
        drawEpidemic();
    }

    function drawEpidemic() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const beta = +document.getElementById("betaSIR").value;
        const gamma = +document.getElementById("gammaSIR").value;
        const simH = 280;
        const R0 = (beta / gamma).toFixed(1);

        if (sirState.running) {
            sirState.t += 0.016;

            sirState.people.forEach(p => {
                // Movement
                p.vx += (Math.random() - 0.5) * 0.3;
                p.vy += (Math.random() - 0.5) * 0.3;
                p.vx *= 0.96; p.vy *= 0.96;
                p.x += p.vx; p.y += p.vy;
                if (p.x < 15) { p.x = 15; p.vx *= -1; }
                if (p.x > W - 15) { p.x = W - 15; p.vx *= -1; }
                if (p.y < 15) { p.y = 15; p.vy *= -1; }
                if (p.y > simH - 15) { p.y = simH - 15; p.vy *= -1; }

                // Recovery
                if (p.state === "I" && sirState.t - p.infectedAt > 1 / gamma * 0.1) {
                    if (Math.random() < gamma * 0.016) {
                        p.state = "R";
                    }
                }
            });

            // Transmission
            const infected = sirState.people.filter(p => p.state === "I");
            const susceptible = sirState.people.filter(p => p.state === "S");
            infected.forEach(inf => {
                susceptible.forEach(sus => {
                    const dx = inf.x - sus.x, dy = inf.y - sus.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 15 && Math.random() < beta * 0.016) {
                        sus.state = "I";
                        sus.infectedAt = sirState.t;
                    }
                });
            });

            // Record
            const sCount = sirState.people.filter(p => p.state === "S").length;
            const iCount = sirState.people.filter(p => p.state === "I").length;
            const rCount = sirState.people.filter(p => p.state === "R").length;
            if (sirState.history.length === 0 || sirState.t - sirState.history[sirState.history.length - 1].t > 0.05) {
                sirState.history.push({ t: sirState.t, S: sCount, I: iCount, R: rCount });
                if (sirState.history.length > 600) sirState.history.shift();
            }
        }

        // Simulation area
        ctx.fillStyle = "rgba(16,20,58,0.3)";
        ctx.fillRect(10, 10, W - 20, simH);
        ctx.strokeStyle = "#2a2f6e"; ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, W - 20, simH);

        // Draw people
        sirState.people.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            if (p.state === "S") ctx.fillStyle = "#42a5f5";
            else if (p.state === "I") ctx.fillStyle = "#ef5350";
            else ctx.fillStyle = "#66bb6a";
            ctx.fill();

            // Infection radius for infected
            if (p.state === "I") {
                ctx.beginPath(); ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
                ctx.strokeStyle = "rgba(239, 83, 80, 0.15)";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        // SIR Graph
        const gx = 50, gy2 = simH + 30, gw2 = W - 100, gh2 = H - simH - 70;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(gx, gy2, gw2, gh2);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(gx, gy2, gw2, gh2);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("SIR Curves", gx + 8, gy2 - 6);

        if (sirState.history.length > 1) {
            const pop = sirState.people.length;
            const tMin = sirState.history[0].t;
            const tMax = sirState.history[sirState.history.length - 1].t;
            const tRange = Math.max(0.1, tMax - tMin);

            // S curve
            ctx.beginPath();
            sirState.history.forEach((h, i) => {
                const px = gx + ((h.t - tMin) / tRange) * gw2;
                const py = gy2 + gh2 - (h.S / pop) * gh2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#42a5f5"; ctx.lineWidth = 2; ctx.stroke();

            // I curve
            ctx.beginPath();
            sirState.history.forEach((h, i) => {
                const px = gx + ((h.t - tMin) / tRange) * gw2;
                const py = gy2 + gh2 - (h.I / pop) * gh2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#ef5350"; ctx.lineWidth = 2; ctx.stroke();

            // R curve
            ctx.beginPath();
            sirState.history.forEach((h, i) => {
                const px = gx + ((h.t - tMin) / tRange) * gw2;
                const py = gy2 + gh2 - (h.R / pop) * gh2;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 2; ctx.stroke();
        }

        // Legend
        const sC = sirState.people.filter(p => p.state === "S").length;
        const iC = sirState.people.filter(p => p.state === "I").length;
        const rC = sirState.people.filter(p => p.state === "R").length;

        ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = "#42a5f5"; ctx.fillText(`Susceptible: ${sC}`, gx + gw2 - 180, gy2 + 16);
        ctx.fillStyle = "#ef5350"; ctx.fillText(`Infected: ${iC}`, gx + gw2 - 180, gy2 + 30);
        ctx.fillStyle = "#66bb6a"; ctx.fillText(`Recovered: ${rC}`, gx + gw2 - 180, gy2 + 44);
        ctx.fillStyle = "#ffeb3b"; ctx.fillText(`R\u2080 = \u03b2/\u03b3 = ${R0}`, gx + gw2 - 180, gy2 + 60);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#ef5350">SIR Epidemic</b><br>` +
            `S: ${sC} | I: ${iC} | R: ${rC}<br>` +
            `R\u2080: ${R0}<br>` +
            `t: ${sirState.t.toFixed(1)}`;

        if (sirState.running) {
            animId = requestAnimationFrame(drawEpidemic);
        }
    }

    bindSlider("betaSIR", "val-betaSIR");
    bindSlider("gammaSIR", "val-gammaSIR");
    bindSlider("sirPop", "val-sirPop");

    document.getElementById("btn-sir-toggle").addEventListener("click", () => {
        sirState.running = !sirState.running;
        document.getElementById("btn-sir-toggle").textContent = sirState.running ? "Pause" : "Resume";
        if (sirState.running) drawEpidemic();
    });
    document.getElementById("btn-sir-reset").addEventListener("click", initEpidemic);

    // ═══════════════════════════════════════════════════════
    // 39. FLUID DYNAMICS (BERNOULLI'S PRINCIPLE)
    // ═══════════════════════════════════════════════════════
    let bernState = { t: 0, running: true, particles: [] };

    function initBernoulli() {
        bernState = { t: 0, running: true, particles: [] };
        // Seed particles
        for (let i = 0; i < 120; i++) {
            bernState.particles.push({
                x: Math.random() * canvas.width,
                y: 0,
                phase: Math.random() * Math.PI * 2
            });
        }
        document.getElementById("btn-bern-toggle").textContent = "Pause";
        drawBernoulli();
    }

    function getPipeY(x, W, H, constrict) {
        const cx = W / 2;
        const pipeHalf = H * 0.35;
        const constrictHalf = pipeHalf * constrict;
        // Smooth constriction using cosine
        const dist = Math.abs(x - cx) / (W * 0.25);
        const factor = dist < 1 ? constrictHalf + (pipeHalf - constrictHalf) * (0.5 - 0.5 * Math.cos(dist * Math.PI)) : pipeHalf;
        return { top: H / 2 - factor, bot: H / 2 + factor, halfH: factor };
    }

    function drawBernoulli() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const flowSpeed = +document.getElementById("flowSpeed").value;
        const constrict = +document.getElementById("constrict").value;
        const density = +document.getElementById("flDensity").value;

        const cy = H / 2;
        const pipeHalf = H * 0.35;

        if (bernState.running) {
            bernState.t += 0.016;
        }

        // Draw pipe walls
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
            const { top } = getPipeY(x, W, H, constrict);
            x === 0 ? ctx.moveTo(x, top) : ctx.lineTo(x, top);
        }
        ctx.strokeStyle = "#546e7a";
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
            const { bot } = getPipeY(x, W, H, constrict);
            x === 0 ? ctx.moveTo(x, bot) : ctx.lineTo(x, bot);
        }
        ctx.strokeStyle = "#546e7a";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Fill pipe interior
        ctx.beginPath();
        for (let x = 0; x <= W; x += 2) {
            const { top } = getPipeY(x, W, H, constrict);
            x === 0 ? ctx.moveTo(x, top) : ctx.lineTo(x, top);
        }
        for (let x = W; x >= 0; x -= 2) {
            const { bot } = getPipeY(x, W, H, constrict);
            ctx.lineTo(x, bot);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(21, 101, 192, 0.12)";
        ctx.fill();

        // Flow particles
        if (bernState.running) {
            bernState.particles.forEach(p => {
                const { halfH } = getPipeY(p.x, W, H, constrict);
                const wideHalf = pipeHalf;
                const localSpeed = flowSpeed * (wideHalf / halfH);
                p.x += localSpeed * 1.5;
                if (p.x > W + 10) p.x = -10;
            });
        }

        bernState.particles.forEach((p, i) => {
            const { top, bot, halfH } = getPipeY(p.x, W, H, constrict);
            const yRange = bot - top - 10;
            // Distribute particle within pipe
            const yFrac = (Math.sin(p.phase + i * 0.3) * 0.5 + 0.5);
            const py = top + 5 + yFrac * yRange;
            const wideHalf = pipeHalf;
            const localSpeed = flowSpeed * (wideHalf / halfH);
            const speedRatio = localSpeed / flowSpeed;

            ctx.beginPath(); ctx.arc(p.x, py, 2.5, 0, Math.PI * 2);
            // Color by speed: blue (slow) to red (fast)
            const hue = Math.max(0, 220 - speedRatio * 100);
            ctx.fillStyle = `hsl(${hue}, 80%, 55%)`;
            ctx.fill();
        });

        // Pressure and velocity indicators
        const positions = [
            { x: W * 0.15, label: "Wide section" },
            { x: W * 0.5, label: "Narrow section" },
            { x: W * 0.85, label: "Wide section" }
        ];

        positions.forEach(pos => {
            const { halfH } = getPipeY(pos.x, W, H, constrict);
            const wideHalf = pipeHalf;
            const areaRatio = halfH / wideHalf;
            const velocity = flowSpeed / areaRatio;
            const P0 = 101325; // atmospheric
            const pressure = P0 + 0.5 * density * 1000 * (flowSpeed * flowSpeed - velocity * velocity);
            const relPressure = ((pressure - P0) / P0 * 100);

            // Velocity arrow
            const arrowLen = velocity * 8;
            const { top, bot } = getPipeY(pos.x, W, H, constrict);
            ctx.beginPath();
            ctx.moveTo(pos.x - arrowLen / 2, (top + bot) / 2);
            ctx.lineTo(pos.x + arrowLen / 2, (top + bot) / 2);
            ctx.strokeStyle = "#ffeb3b";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pos.x + arrowLen / 2, (top + bot) / 2);
            ctx.lineTo(pos.x + arrowLen / 2 - 6, (top + bot) / 2 - 4);
            ctx.lineTo(pos.x + arrowLen / 2 - 6, (top + bot) / 2 + 4);
            ctx.closePath();
            ctx.fillStyle = "#ffeb3b"; ctx.fill();

            // Labels
            ctx.fillStyle = "#ccc"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
            ctx.fillText(pos.label, pos.x, top - 25);
            ctx.fillStyle = "#ffeb3b";
            ctx.fillText(`v = ${velocity.toFixed(1)}`, pos.x, top - 12);
            ctx.fillStyle = relPressure >= 0 ? "#66bb6a" : "#ef5350";
            ctx.fillText(`\u0394P = ${relPressure.toFixed(1)}%`, pos.x, bot + 18);

            // Manometer tubes
            const tubeH = 60 + relPressure * 2;
            ctx.fillStyle = "rgba(33, 150, 243, 0.4)";
            ctx.fillRect(pos.x - 5, bot + 25, 10, Math.max(10, tubeH));
            ctx.strokeStyle = "#546e7a"; ctx.lineWidth = 1;
            ctx.strokeRect(pos.x - 5, bot + 25, 10, Math.max(10, tubeH));
        });

        // Bernoulli equation
        ctx.fillStyle = "#ccc"; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("P\u2081 + \u00bdpv\u2081\u00b2 = P\u2082 + \u00bdpv\u2082\u00b2  (Bernoulli's Equation)", W / 2, H - 35);
        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif";
        ctx.fillText("Higher velocity \u2192 Lower pressure  |  Continuity: A\u2081v\u2081 = A\u2082v\u2082", W / 2, H - 15);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#42a5f5">Bernoulli's Principle</b><br>` +
            `Flow: ${flowSpeed.toFixed(1)}<br>` +
            `Constriction: ${(constrict * 100).toFixed(0)}%<br>` +
            `\u03c1: ${density} kg/m\u00b3`;

        if (bernState.running) {
            animId = requestAnimationFrame(drawBernoulli);
        }
    }

    bindSlider("flowSpeed", "val-flowSpeed");
    bindSlider("constrict", "val-constrict");
    bindSlider("flDensity", "val-flDensity");

    document.getElementById("btn-bern-toggle").addEventListener("click", () => {
        bernState.running = !bernState.running;
        document.getElementById("btn-bern-toggle").textContent = bernState.running ? "Pause" : "Resume";
        if (bernState.running) drawBernoulli();
    });
    document.getElementById("btn-bern-reset").addEventListener("click", initBernoulli);

    // ── Start default simulation ────────────────────────────
    initProjectile();
})();
