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
            case "gravlens":    initGravLens();     break;
            case "standing":    initStanding();     break;
            case "protein":     initProtein();      break;
            case "carbon":      initCarbon();       break;
            case "spectral":    initSpectral();     break;
            case "redshift":    initRedshift();     break;
            case "qho":         initQHO();          break;
            case "tectonic":    initTectonic();     break;
            case "titration":   initTitration();    break;
            case "lorenz":      initLorenz();       break;
            case "fourier":     initFourier();      break;
            case "galton":      initGalton();       break;
            case "stressstrain":initStressStrain(); break;
            case "reactiondiff":initReactionDiff(); break;
            case "fluidflow":   initFluidFlow();    break;
            case "phasespace":  initPhaseSpace();   break;
            case "radiocarbon": initRadiocarbon();  break;
            case "mandelbrot":  initMandelbrot();   break;
            case "shm":         initSHM();          break;
            case "vector":      initVectorField();  break;
            case "capacitor":   initCapacitor();    break;
            case "brachistochrone": initBrachistochrone(); break;
            case "brownian":    initBrownian();     break;
            case "wavepacket":  initWavePacket();   break;
            case "trebuchet":   initTrebuchet();    break;
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

    // ═══════════════════════════════════════════════════════
    // 40. GRAVITATIONAL LENSING
    // ═══════════════════════════════════════════════════════

    function initGravLens() {
        drawGravLens();
    }

    function drawGravLens() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const mass = +document.getElementById("lensMass").value;
        const srcDist = +document.getElementById("srcDist").value;
        const showPaths = document.getElementById("showPaths").checked;
        const cx = W / 2, cy = H / 2;

        // Starfield background
        for (let i = 0; i < 150; i++) {
            const sx = (i * 137.5) % W;
            const sy = (i * 83.3 + i * i * 0.1) % H;
            const bright = 0.2 + (i % 5) * 0.15;
            ctx.beginPath(); ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,200,255,${bright})`;
            ctx.fill();
        }

        const einsteinR = mass * 18;

        // Distort background stars near lens
        for (let i = 0; i < 80; i++) {
            const sx = (i * 97.3 + 50) % W;
            const sy = (i * 61.7 + 30) % H;
            const dx = sx - cx, dy = sy - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < einsteinR * 3 && dist > 20) {
                const deflection = einsteinR * einsteinR / dist;
                const angle = Math.atan2(dy, dx);
                const newX = sx + deflection * Math.cos(angle);
                const newY = sy + deflection * Math.sin(angle);
                const stretch = 1 + deflection / dist * 0.3;

                ctx.beginPath();
                ctx.ellipse(newX, newY, 1.5 * stretch, 1, angle, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200,220,255,${Math.min(0.8, 0.3 + deflection * 0.01)})`;
                ctx.fill();
            }
        }

        // Background source (galaxy/star)
        const srcX = cx, srcY = cy + srcDist;
        // Actual source position indicator
        ctx.beginPath(); ctx.arc(srcX, Math.min(srcY, H - 20), 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,200,50,0.3)";
        ctx.fill();
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(srcX, Math.min(srcY, H - 20)); ctx.lineTo(srcX, cy + 30);
        ctx.strokeStyle = "rgba(255,200,50,0.15)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);

        // Einstein ring (when perfectly aligned)
        const alignment = 1 - Math.abs(srcX - cx) / 100;
        if (alignment > 0.5) {
            ctx.beginPath();
            ctx.arc(cx, cy, einsteinR, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(100, 180, 255, ${(alignment - 0.5) * 0.8})`;
            ctx.lineWidth = 3 + mass * 0.3;
            ctx.stroke();

            // Glow
            const rGrad = ctx.createRadialGradient(cx, cy, einsteinR - 5, cx, cy, einsteinR + 10);
            rGrad.addColorStop(0, "rgba(100, 180, 255, 0)");
            rGrad.addColorStop(0.5, `rgba(100, 180, 255, ${(alignment - 0.5) * 0.3})`);
            rGrad.addColorStop(1, "rgba(100, 180, 255, 0)");
            ctx.beginPath(); ctx.arc(cx, cy, einsteinR + 10, 0, Math.PI * 2);
            ctx.fillStyle = rGrad; ctx.fill();
        }

        // Lensed images (arcs)
        const numArcs = 4;
        for (let i = 0; i < numArcs; i++) {
            const angle = (i / numArcs) * Math.PI * 2 + Math.PI / 4;
            const arcR = einsteinR * (0.9 + Math.sin(angle * 2) * 0.2);
            const arcLen = 0.3 + (1 - Math.abs(srcDist - 200) / 200) * 0.4;

            ctx.beginPath();
            ctx.arc(cx, cy, arcR, angle - arcLen, angle + arcLen);
            ctx.strokeStyle = `rgba(255, 200, 100, ${0.4 + Math.sin(i) * 0.2})`;
            ctx.lineWidth = 2 + mass * 0.2;
            ctx.stroke();
        }

        // Light paths
        if (showPaths) {
            const numRays = 12;
            for (let i = 0; i < numRays; i++) {
                const startAngle = (i / numRays) * Math.PI * 2;
                const startX = cx + 250 * Math.cos(startAngle);
                const startY = cy + 250 * Math.sin(startAngle);

                ctx.beginPath();
                ctx.moveTo(startX, startY);

                // Ray bending toward center then deflecting
                const steps = 50;
                let rx = startX, ry = startY;
                for (let s = 0; s < steps; s++) {
                    const ddx = cx - rx, ddy = cy - ry;
                    const dd = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (dd < 15) break;
                    const bend = mass * 5 / (dd * dd);
                    const dirX = (ddx / dd) * bend + (cx - startX) / 250 * -0.5;
                    const dirY = (ddy / dd) * bend + (cy - startY) / 250 * -0.5;
                    rx += dirX * 8 - (startX - cx) / 250 * 3;
                    ry += dirY * 8 - (startY - cy) / 250 * 3;
                    ctx.lineTo(rx, ry);
                }
                ctx.strokeStyle = `rgba(255, 235, 59, 0.08)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        // Lensing mass (galaxy cluster)
        const lensGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 25 + mass * 2);
        lensGrad.addColorStop(0, "rgba(255,200,150,0.8)");
        lensGrad.addColorStop(0.4, "rgba(200,150,100,0.4)");
        lensGrad.addColorStop(1, "rgba(100,80,60,0)");
        ctx.beginPath(); ctx.arc(cx, cy, 25 + mass * 2, 0, Math.PI * 2);
        ctx.fillStyle = lensGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,220,180,0.9)"; ctx.fill();

        // Einstein radius indicator
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.arc(cx, cy, einsteinR, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);

        // Labels
        ctx.fillStyle = "#ffeb3b"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Einstein Radius", cx, cy - einsteinR - 8);
        ctx.fillStyle = "#ff9800";
        ctx.fillText("Lensing Mass", cx, cy + 35 + mass * 2);
        ctx.fillStyle = "rgba(255,200,50,0.6)"; ctx.font = "10px sans-serif";
        ctx.fillText("Background Source", srcX, Math.min(srcY + 20, H - 8));

        // Info
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(20, H - 80, 280, 65);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(20, H - 80, 280, 65);
        ctx.fillStyle = "#ccc"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`Einstein radius: ${einsteinR.toFixed(0)} px`, 30, H - 60);
        ctx.fillText(`\u03b8_E = \u221a(4GM/c\u00b2 \u00b7 D_LS/D_L\u00b7D_S)`, 30, H - 42);
        ctx.fillText(`Lens mass: ${mass}x | Source dist: ${srcDist}`, 30, H - 24);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#64b5f6">Grav. Lensing</b><br>` +
            `Mass: ${mass}x<br>` +
            `\u03b8_E: ${einsteinR.toFixed(0)} px<br>` +
            `Src dist: ${srcDist}`;
    }

    bindSlider("lensMass", "val-lensMass", () => { if (currentSim === "gravlens") drawGravLens(); });
    bindSlider("srcDist", "val-srcDist", () => { if (currentSim === "gravlens") drawGravLens(); });
    document.getElementById("showPaths").addEventListener("change", () => { if (currentSim === "gravlens") drawGravLens(); });
    document.getElementById("btn-gl-reset").addEventListener("click", initGravLens);

    // ═══════════════════════════════════════════════════════
    // 41. STANDING WAVES
    // ═══════════════════════════════════════════════════════
    let swState = { t: 0, running: true };

    function initStanding() {
        swState = { t: 0, running: true };
        document.getElementById("btn-sw-toggle").textContent = "Pause";
        drawStanding();
    }

    function drawStanding() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const n = +document.getElementById("harmonic").value;
        const amp = +document.getElementById("swAmp").value;
        const showComp = document.getElementById("showComponents").checked;
        const cy = H / 2 - 40;
        const startX = 60, endX = W - 60;
        const L = endX - startX;

        if (swState.running) {
            swState.t += 0.04;
        }

        // Fixed endpoints
        ctx.fillStyle = "#78909c";
        ctx.fillRect(startX - 6, cy - 15, 6, 30);
        ctx.fillRect(endX, cy - 15, 6, 30);

        // Axis
        ctx.beginPath(); ctx.moveTo(startX, cy); ctx.lineTo(endX, cy);
        ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = 1; ctx.stroke();

        // Component travelling waves
        if (showComp) {
            // Right-travelling wave
            ctx.beginPath();
            for (let x = startX; x <= endX; x++) {
                const frac = (x - startX) / L;
                const y = cy + amp * 0.5 * Math.sin(n * Math.PI * frac - swState.t);
                x === startX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.strokeStyle = "rgba(239, 83, 80, 0.3)"; ctx.lineWidth = 1; ctx.stroke();

            // Left-travelling wave
            ctx.beginPath();
            for (let x = startX; x <= endX; x++) {
                const frac = (x - startX) / L;
                const y = cy + amp * 0.5 * Math.sin(n * Math.PI * frac + swState.t);
                x === startX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.strokeStyle = "rgba(66, 165, 245, 0.3)"; ctx.lineWidth = 1; ctx.stroke();
        }

        // Standing wave (sum)
        ctx.beginPath();
        for (let x = startX; x <= endX; x++) {
            const frac = (x - startX) / L;
            const y = cy + amp * Math.sin(n * Math.PI * frac) * Math.cos(swState.t);
            x === startX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 3; ctx.stroke();

        // Envelope
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let x = startX; x <= endX; x++) {
            const frac = (x - startX) / L;
            const y = cy + amp * Math.sin(n * Math.PI * frac);
            x === startX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.beginPath();
        for (let x = startX; x <= endX; x++) {
            const frac = (x - startX) / L;
            const y = cy - amp * Math.sin(n * Math.PI * frac);
            x === startX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Nodes and antinodes
        for (let i = 0; i <= n; i++) {
            const nx = startX + (i / n) * L;
            ctx.beginPath(); ctx.arc(nx, cy, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#ef5350"; ctx.fill();
            ctx.fillStyle = "#ef5350"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
            if (i === 0 || i === n) ctx.fillText("N", nx, cy + 18);
            else ctx.fillText("N", nx, cy + 18);
        }
        for (let i = 0; i < n; i++) {
            const ax = startX + ((i + 0.5) / n) * L;
            ctx.beginPath(); ctx.arc(ax, cy, 4, 0, Math.PI * 2);
            ctx.fillStyle = "#42a5f5"; ctx.fill();
            ctx.fillStyle = "#42a5f5"; ctx.font = "9px sans-serif";
            ctx.fillText("A", ax, cy + 18);
        }

        // Info section
        const freq = n;
        const wavelength = 2 * L / n;

        ctx.fillStyle = "rgba(16,20,58,0.8)";
        ctx.fillRect(50, H - 160, W - 100, 130);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(50, H - 160, W - 100, 130);

        ctx.fillStyle = "#66bb6a"; ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`Harmonic n = ${n}`, W / 2, H - 138);

        ctx.font = "13px sans-serif"; ctx.fillStyle = "#ccc";
        ctx.fillText(`\u03bb = 2L/n = ${wavelength.toFixed(0)} px`, W / 2, H - 115);
        ctx.fillText(`f_n = n \u00b7 f\u2081  (${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"} harmonic)`, W / 2, H - 95);
        ctx.fillText(`Nodes: ${n + 1}  |  Antinodes: ${n}`, W / 2, H - 75);

        // Harmonic series visualization
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif";
        ctx.fillText("Harmonic Series:", W / 2, H - 52);
        for (let h = 1; h <= 8; h++) {
            const hx = W / 2 - 140 + (h - 1) * 40;
            ctx.fillStyle = h === n ? "#66bb6a" : "#444";
            ctx.fillRect(hx, H - 42, 30, 14);
            ctx.fillStyle = h === n ? "#fff" : "#888";
            ctx.font = "10px sans-serif";
            ctx.fillText(`n=${h}`, hx + 15, H - 32);
        }

        // Legend
        ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = "#ef5350"; ctx.fillText("\u25cf Node (zero displacement)", 60, H - 168);
        ctx.fillStyle = "#42a5f5"; ctx.fillText("\u25cf Antinode (max displacement)", 280, H - 168);
        if (showComp) {
            ctx.fillStyle = "rgba(239,83,80,0.5)"; ctx.fillText("\u2014 Right wave", 530, H - 168);
            ctx.fillStyle = "rgba(66,165,245,0.5)"; ctx.fillText("\u2014 Left wave", 650, H - 168);
        }

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#66bb6a">Standing Wave</b><br>` +
            `n: ${n}<br>` +
            `\u03bb: ${wavelength.toFixed(0)} px<br>` +
            `Nodes: ${n + 1}`;

        if (swState.running) {
            animId = requestAnimationFrame(drawStanding);
        }
    }

    bindSlider("harmonic", "val-harmonic");
    bindSlider("swAmp", "val-swAmp");
    document.getElementById("showComponents").addEventListener("change", () => { /* live */ });

    document.getElementById("btn-sw-toggle").addEventListener("click", () => {
        swState.running = !swState.running;
        document.getElementById("btn-sw-toggle").textContent = swState.running ? "Pause" : "Resume";
        if (swState.running) drawStanding();
    });
    document.getElementById("btn-sw-reset").addEventListener("click", initStanding);

    // ═══════════════════════════════════════════════════════
    // 42. PROTEIN FOLDING
    // ═══════════════════════════════════════════════════════
    let protState = {};

    const aminoAcids = [
        { code: "A", name: "Ala", hydro: 1.8, color: "#ff9800" },
        { code: "V", name: "Val", hydro: 4.2, color: "#ff5722" },
        { code: "L", name: "Leu", hydro: 3.8, color: "#f44336" },
        { code: "G", name: "Gly", hydro: -0.4, color: "#42a5f5" },
        { code: "S", name: "Ser", hydro: -0.8, color: "#29b6f6" },
        { code: "K", name: "Lys", hydro: -3.9, color: "#7c4dff" },
        { code: "D", name: "Asp", hydro: -3.5, color: "#651fff" },
        { code: "P", name: "Pro", hydro: -1.6, color: "#66bb6a" }
    ];

    function initProtein() {
        const len = +document.getElementById("chainLen").value;
        const W = canvas.width, H = canvas.height;
        const chain = [];
        for (let i = 0; i < len; i++) {
            chain.push({
                x: 80 + (i / len) * (W - 160),
                y: H / 2 + (Math.random() - 0.5) * 20,
                vx: 0, vy: 0,
                aa: aminoAcids[Math.floor(Math.random() * aminoAcids.length)]
            });
        }
        protState = { chain, running: false, t: 0, energy: 0 };
        drawProtein();
    }

    function drawProtein() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const temp = +document.getElementById("foldTemp").value;
        const bondLen = 20;

        if (protState.running) {
            protState.t += 0.016;
            const chain = protState.chain;

            // Forces
            chain.forEach(a => { a.vx = 0; a.vy = 0; });

            // Bond constraints (spring)
            for (let i = 0; i < chain.length - 1; i++) {
                const a = chain[i], b = chain[i + 1];
                const dx = b.x - a.x, dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const force = (dist - bondLen) * 0.1;
                const nx = dx / dist * force, ny = dy / dist * force;
                a.vx += nx; a.vy += ny;
                b.vx -= nx; b.vy -= ny;
            }

            // Hydrophobic collapse (attract hydrophobic residues to center)
            let cx2 = 0, cy2 = 0;
            chain.forEach(a => { cx2 += a.x; cy2 += a.y; });
            cx2 /= chain.length; cy2 /= chain.length;

            chain.forEach(a => {
                if (a.aa.hydro > 0) {
                    // Pull toward center
                    a.vx += (cx2 - a.x) * 0.002 * a.aa.hydro;
                    a.vy += (cy2 - a.y) * 0.002 * a.aa.hydro;
                } else {
                    // Push hydrophilic outward slightly
                    a.vx -= (cx2 - a.x) * 0.001;
                    a.vy -= (cy2 - a.y) * 0.001;
                }
            });

            // Repulsion between non-bonded residues
            for (let i = 0; i < chain.length; i++) {
                for (let j = i + 3; j < chain.length; j++) {
                    const dx = chain[j].x - chain[i].x;
                    const dy = chain[j].y - chain[i].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 15) {
                        const repel = (15 - dist) * 0.05;
                        chain[i].vx -= (dx / dist) * repel;
                        chain[i].vy -= (dy / dist) * repel;
                        chain[j].vx += (dx / dist) * repel;
                        chain[j].vy += (dy / dist) * repel;
                    }
                }
            }

            // Thermal noise
            chain.forEach(a => {
                a.vx += (Math.random() - 0.5) * temp * 0.5;
                a.vy += (Math.random() - 0.5) * temp * 0.5;
                a.x += a.vx;
                a.y += a.vy;
                // Bounds
                a.x = Math.max(20, Math.min(W - 20, a.x));
                a.y = Math.max(20, Math.min(H - 60, a.y));
            });

            // Calculate energy
            let energy = 0;
            for (let i = 0; i < chain.length; i++) {
                const dx = chain[i].x - cx2, dy = chain[i].y - cy2;
                const dist = Math.sqrt(dx * dx + dy * dy);
                energy += chain[i].aa.hydro > 0 ? dist * 0.01 : -dist * 0.005;
            }
            protState.energy = energy;
        }

        // Draw bonds (backbone)
        ctx.beginPath();
        protState.chain.forEach((a, i) => {
            i === 0 ? ctx.moveTo(a.x, a.y) : ctx.lineTo(a.x, a.y);
        });
        ctx.strokeStyle = "rgba(200,200,220,0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw amino acids
        protState.chain.forEach((a, i) => {
            const r = 6 + (a.aa.hydro > 0 ? 2 : 0);
            ctx.beginPath(); ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
            ctx.fillStyle = a.aa.color; ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1; ctx.stroke();

            // Label every 5th
            if (i % 5 === 0) {
                ctx.fillStyle = "#fff"; ctx.font = "bold 7px monospace"; ctx.textAlign = "center";
                ctx.fillText(a.aa.code, a.x, a.y + 3);
            }
        });

        // N and C terminus
        const first = protState.chain[0], last = protState.chain[protState.chain.length - 1];
        ctx.fillStyle = "#4caf50"; ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("N", first.x, first.y - 12);
        ctx.fillStyle = "#f44336";
        ctx.fillText("C", last.x, last.y - 12);

        // Legend
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(20, H - 80, W - 40, 65);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(20, H - 80, W - 40, 65);

        ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = "#ff5722"; ctx.fillText("\u25cf Hydrophobic (core)", 30, H - 62);
        ctx.fillStyle = "#42a5f5"; ctx.fillText("\u25cf Hydrophilic (surface)", 180, H - 62);
        ctx.fillStyle = "#7c4dff"; ctx.fillText("\u25cf Charged", 350, H - 62);
        ctx.fillStyle = "#66bb6a"; ctx.fillText("\u25cf Special (Pro)", 460, H - 62);

        ctx.fillStyle = "#ccc"; ctx.font = "11px sans-serif";
        ctx.fillText(`Chain: ${protState.chain.length} residues  |  Energy: ${protState.energy.toFixed(1)}  |  Temp: ${temp}`, 30, H - 38);
        ctx.fillText("Hydrophobic residues collapse to the core; hydrophilic residues face the solvent.", 30, H - 22);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#ff9800">Protein Folding</b><br>` +
            `Residues: ${protState.chain.length}<br>` +
            `Energy: ${protState.energy.toFixed(1)}<br>` +
            `Temp: ${temp}`;

        if (protState.running) {
            animId = requestAnimationFrame(drawProtein);
        }
    }

    bindSlider("chainLen", "val-chainLen", () => initProtein());
    bindSlider("foldTemp", "val-foldTemp");

    document.getElementById("btn-prot-fold").addEventListener("click", () => {
        if (!protState.running) {
            protState.running = true;
            drawProtein();
        }
    });
    document.getElementById("btn-prot-reset").addEventListener("click", initProtein);

    // ═══════════════════════════════════════════════════════
    // 43. CARBON CYCLE
    // ═══════════════════════════════════════════════════════
    let carbState = { t: 0, running: true, particles: [],
        atm: 400, bio: 550, ocean: 900, litho: 60000 };

    function initCarbon() {
        carbState = { t: 0, running: true, particles: [],
            atm: 400, bio: 550, ocean: 900, litho: 60000 };
        document.getElementById("btn-carb-toggle").textContent = "Pause";
        drawCarbon();
    }

    function drawCarbon() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const emissions = +document.getElementById("emissions").value / 100;
        const deforest = +document.getElementById("deforest").value / 100;
        const oceanAbs = +document.getElementById("oceanAbs").value / 100;

        if (carbState.running) {
            carbState.t += 0.016;

            // Carbon fluxes (simplified)
            const photosynth = 120 * (1 - deforest * 0.5);
            const respiration = 110;
            const oceanUptake = 90 * oceanAbs;
            const oceanRelease = 80;
            const fossilFuel = 10 * emissions;
            const volcanism = 0.1;

            const dt = 0.001;
            carbState.atm += (respiration - photosynth + fossilFuel + volcanism - oceanUptake + oceanRelease) * dt;
            carbState.bio += (photosynth - respiration - deforest * 5) * dt;
            carbState.ocean += (oceanUptake - oceanRelease) * dt;

            carbState.atm = Math.max(200, carbState.atm);
            carbState.bio = Math.max(100, carbState.bio);

            // Particles for visualization
            if (Math.random() < 0.1) {
                const types = ["photo", "resp", "fossil", "ocean_in", "ocean_out"];
                const type = types[Math.floor(Math.random() * types.length)];
                let p = { type, progress: 0, speed: 0.01 + Math.random() * 0.01 };
                carbState.particles.push(p);
            }
            carbState.particles.forEach(p => { p.progress += p.speed; });
            carbState.particles = carbState.particles.filter(p => p.progress < 1);
            if (carbState.particles.length > 40) carbState.particles.splice(0, 10);
        }

        // Reservoirs
        // Atmosphere (top)
        const atmGrad = ctx.createLinearGradient(0, 0, 0, 120);
        atmGrad.addColorStop(0, `rgba(100, 149, 237, ${0.15 + carbState.atm / 2000})`);
        atmGrad.addColorStop(1, "rgba(100, 149, 237, 0.02)");
        ctx.fillStyle = atmGrad;
        ctx.fillRect(0, 0, W, 120);
        ctx.fillStyle = "#90caf9"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("ATMOSPHERE", W / 2, 25);
        ctx.fillStyle = "#ccc"; ctx.font = "12px sans-serif";
        ctx.fillText(`CO\u2082: ${carbState.atm.toFixed(0)} GtC`, W / 2, 45);

        // Biosphere (left-center)
        ctx.fillStyle = "rgba(27, 94, 32, 0.3)";
        ctx.fillRect(30, 140, 250, 180);
        ctx.strokeStyle = "#43a047"; ctx.lineWidth = 2;
        ctx.strokeRect(30, 140, 250, 180);
        // Trees
        for (let i = 0; i < 5; i++) {
            const tx = 60 + i * 45, ty = 200;
            const treeH = 50 * (1 - deforest * 0.5);
            ctx.fillStyle = "#33691e";
            ctx.beginPath();
            ctx.moveTo(tx, ty - treeH); ctx.lineTo(tx - 15, ty); ctx.lineTo(tx + 15, ty);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#4e342e";
            ctx.fillRect(tx - 3, ty, 6, 15);
        }
        ctx.fillStyle = "#66bb6a"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("BIOSPHERE", 155, 158);
        ctx.fillStyle = "#a5d6a7"; ctx.font = "11px sans-serif";
        ctx.fillText(`${carbState.bio.toFixed(0)} GtC`, 155, 310);

        // Ocean (right)
        ctx.fillStyle = "rgba(13, 71, 161, 0.3)";
        ctx.fillRect(320, 140, 260, 180);
        ctx.strokeStyle = "#1565c0"; ctx.lineWidth = 2;
        ctx.strokeRect(320, 140, 260, 180);
        // Waves
        ctx.beginPath();
        for (let x = 320; x <= 580; x++) {
            const y = 160 + Math.sin(x * 0.05 + carbState.t * 2) * 5;
            x === 320 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(100,180,255,0.3)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "#42a5f5"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("OCEAN", 450, 158);
        ctx.fillStyle = "#90caf9"; ctx.font = "11px sans-serif";
        ctx.fillText(`${carbState.ocean.toFixed(0)} GtC`, 450, 310);

        // Lithosphere (bottom)
        ctx.fillStyle = "rgba(62, 39, 35, 0.4)";
        ctx.fillRect(30, 360, 550, 100);
        ctx.strokeStyle = "#5d4037"; ctx.lineWidth = 2;
        ctx.strokeRect(30, 360, 550, 100);
        // Rock layers
        for (let y = 380; y < 460; y += 20) {
            ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(580, y);
            ctx.strokeStyle = "rgba(121, 85, 72, 0.3)"; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.fillStyle = "#8d6e63"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("LITHOSPHERE (Fossil Fuels, Sediments)", 305, 378);
        ctx.fillStyle = "#bcaaa4"; ctx.font = "11px sans-serif";
        ctx.fillText(`~${(carbState.litho / 1000).toFixed(0)},000 GtC`, 305, 440);

        // Fossil fuel icon
        ctx.fillStyle = "#212121";
        ctx.fillRect(620, 370, 70, 50);
        ctx.strokeStyle = "#424242"; ctx.strokeRect(620, 370, 70, 50);
        ctx.fillStyle = "#616161"; ctx.font = "10px sans-serif";
        ctx.fillText("Fossil", 655, 390);
        ctx.fillText("Fuels", 655, 405);

        // Flux arrows
        const drawFluxArrow = (x1, y1, x2, y2, label, color, amount) => {
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
            ctx.strokeStyle = color; ctx.lineWidth = 1.5 + amount * 0.02; ctx.stroke();
            const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            ctx.fillStyle = color; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
            ctx.fillText(label, mx + 15, my);
        };

        // Photosynthesis (atm -> bio)
        drawFluxArrow(120, 120, 120, 140, "Photosynthesis", "#66bb6a", 120 * (1 - deforest * 0.5));
        // Respiration (bio -> atm)
        drawFluxArrow(200, 140, 200, 120, "Respiration", "#ff9800", 110);
        // Ocean uptake (atm -> ocean)
        drawFluxArrow(400, 120, 400, 140, "Absorption", "#42a5f5", 90 * oceanAbs);
        // Ocean release (ocean -> atm)
        drawFluxArrow(500, 140, 500, 120, "Release", "#90caf9", 80);
        // Fossil fuel emissions
        drawFluxArrow(655, 370, 655, 120, `Emissions`, "#ef5350", 10 * emissions);
        // Decomposition to lithosphere
        drawFluxArrow(155, 320, 155, 360, "Burial", "#8d6e63", 1);

        // Particles along paths
        carbState.particles.forEach(p => {
            let px, py;
            const pr = p.progress;
            if (p.type === "photo") {
                px = 120; py = 120 + pr * 20;
                ctx.fillStyle = "rgba(102, 187, 106, 0.7)";
            } else if (p.type === "resp") {
                px = 200; py = 140 - pr * 20;
                ctx.fillStyle = "rgba(255, 152, 0, 0.7)";
            } else if (p.type === "fossil") {
                px = 655; py = 370 - pr * 250;
                ctx.fillStyle = "rgba(239, 83, 80, 0.7)";
            } else if (p.type === "ocean_in") {
                px = 400; py = 120 + pr * 20;
                ctx.fillStyle = "rgba(66, 165, 245, 0.7)";
            } else {
                px = 500; py = 140 - pr * 20;
                ctx.fillStyle = "rgba(144, 202, 249, 0.7)";
            }
            ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
        });

        // CO2 trend
        const ppm = 280 + (carbState.atm - 400) * 0.5 + emissions * 140;
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(620, 140, 170, 60);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(620, 140, 170, 60);
        ctx.fillStyle = carbState.atm > 500 ? "#ef5350" : "#ffeb3b";
        ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`~${ppm.toFixed(0)} ppm CO\u2082`, 705, 165);
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif";
        ctx.fillText(carbState.atm > 500 ? "Above safe levels!" : "Pre-industrial: 280 ppm", 705, 185);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#90caf9">Carbon Cycle</b><br>` +
            `Atm: ${carbState.atm.toFixed(0)} GtC<br>` +
            `Bio: ${carbState.bio.toFixed(0)} GtC<br>` +
            `Ocean: ${carbState.ocean.toFixed(0)} GtC`;

        if (carbState.running) {
            animId = requestAnimationFrame(drawCarbon);
        }
    }

    bindSlider("emissions", "val-emissions");
    bindSlider("deforest", "val-deforest");
    bindSlider("oceanAbs", "val-oceanAbs");

    document.getElementById("btn-carb-toggle").addEventListener("click", () => {
        carbState.running = !carbState.running;
        document.getElementById("btn-carb-toggle").textContent = carbState.running ? "Pause" : "Resume";
        if (carbState.running) drawCarbon();
    });
    document.getElementById("btn-carb-reset").addEventListener("click", initCarbon);

    // ═══════════════════════════════════════════════════════
    // 44. ATOMIC EMISSION SPECTRA
    // ═══════════════════════════════════════════════════════

    const spectralData = {
        hydrogen: {
            name: "Hydrogen (H)",
            lines: [
                { wl: 410, series: "Balmer", transition: "6\u21922" },
                { wl: 434, series: "Balmer", transition: "5\u21922" },
                { wl: 486, series: "Balmer", transition: "4\u21922" },
                { wl: 656, series: "Balmer", transition: "3\u21922" }
            ],
            levels: [-13.6, -3.4, -1.51, -0.85, -0.54, -0.38]
        },
        helium: {
            name: "Helium (He)",
            lines: [
                { wl: 388, series: "", transition: "" },
                { wl: 447, series: "", transition: "" },
                { wl: 471, series: "", transition: "" },
                { wl: 492, series: "", transition: "" },
                { wl: 501, series: "", transition: "" },
                { wl: 587, series: "", transition: "" },
                { wl: 668, series: "", transition: "" },
                { wl: 706, series: "", transition: "" }
            ],
            levels: [-24.6, -4.77, -3.62, -1.87, -0.85]
        },
        neon: {
            name: "Neon (Ne)",
            lines: [
                { wl: 540, series: "", transition: "" },
                { wl: 585, series: "", transition: "" },
                { wl: 603, series: "", transition: "" },
                { wl: 616, series: "", transition: "" },
                { wl: 626, series: "", transition: "" },
                { wl: 640, series: "", transition: "" },
                { wl: 650, series: "", transition: "" },
                { wl: 660, series: "", transition: "" },
                { wl: 693, series: "", transition: "" }
            ],
            levels: [-21.6, -5.1, -4.9, -4.0, -1.5]
        },
        sodium: {
            name: "Sodium (Na)",
            lines: [
                { wl: 330, series: "", transition: "" },
                { wl: 498, series: "", transition: "" },
                { wl: 569, series: "", transition: "" },
                { wl: 589, series: "D-line", transition: "3p\u21923s" },
                { wl: 590, series: "D-line", transition: "3p\u21923s" },
                { wl: 616, series: "", transition: "" },
                { wl: 819, series: "", transition: "" }
            ],
            levels: [-5.14, -3.04, -1.95, -1.02, -0.51]
        },
        mercury: {
            name: "Mercury (Hg)",
            lines: [
                { wl: 365, series: "", transition: "" },
                { wl: 405, series: "", transition: "" },
                { wl: 436, series: "", transition: "" },
                { wl: 546, series: "", transition: "" },
                { wl: 577, series: "", transition: "" },
                { wl: 579, series: "", transition: "" }
            ],
            levels: [-10.4, -5.77, -4.89, -3.73, -2.48]
        }
    };

    function wlToRGB(wl) {
        let r = 0, g = 0, b = 0;
        if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
        else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
        else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
        else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
        else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
        else if (wl >= 645 && wl <= 780) { r = 1; }
        return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
    }

    function initSpectral() {
        drawSpectral();
    }

    function drawSpectral() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const elem = document.getElementById("element").value;
        const showLevels = document.getElementById("showELevels").checked;
        const data = spectralData[elem];

        // Title
        ctx.fillStyle = "#ccc"; ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`Emission Spectrum: ${data.name}`, W / 2, 25);

        // Continuous spectrum reference
        const specY = 50, specH = 40;
        for (let x = 60; x < W - 60; x++) {
            const wl = 380 + ((x - 60) / (W - 120)) * 400;
            ctx.fillStyle = wlToRGB(wl);
            ctx.fillRect(x, specY, 1, specH);
        }
        ctx.strokeStyle = "#555"; ctx.lineWidth = 1;
        ctx.strokeRect(60, specY, W - 120, specH);
        ctx.fillStyle = "#aab"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Continuous Spectrum (reference)", W / 2, specY - 6);

        // Emission spectrum (dark background with bright lines)
        const emY = 110, emH = 60;
        ctx.fillStyle = "#0a0a14";
        ctx.fillRect(60, emY, W - 120, emH);
        ctx.strokeStyle = "#333"; ctx.lineWidth = 1;
        ctx.strokeRect(60, emY, W - 120, emH);

        data.lines.forEach(line => {
            if (line.wl >= 380 && line.wl <= 780) {
                const x = 60 + ((line.wl - 380) / 400) * (W - 120);
                ctx.fillStyle = wlToRGB(line.wl);
                ctx.fillRect(x - 1.5, emY, 3, emH);
                // Glow
                const glow = ctx.createLinearGradient(x - 8, 0, x + 8, 0);
                glow.addColorStop(0, "rgba(0,0,0,0)");
                glow.addColorStop(0.5, wlToRGB(line.wl).replace("rgb", "rgba").replace(")", ",0.15)"));
                glow.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = glow;
                ctx.fillRect(x - 8, emY, 16, emH);
            }
        });

        ctx.fillStyle = "#aab"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Emission Spectrum", W / 2, emY - 6);

        // Wavelength labels
        data.lines.forEach(line => {
            if (line.wl >= 380 && line.wl <= 780) {
                const x = 60 + ((line.wl - 380) / 400) * (W - 120);
                ctx.fillStyle = wlToRGB(line.wl);
                ctx.font = "9px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`${line.wl}`, x, emY + emH + 12);
                if (line.series) {
                    ctx.fillStyle = "#667";
                    ctx.fillText(line.series, x, emY + emH + 24);
                }
            }
        });

        // Wavelength axis
        ctx.fillStyle = "#556"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        for (let wl = 400; wl <= 750; wl += 50) {
            const x = 60 + ((wl - 380) / 400) * (W - 120);
            ctx.fillText(`${wl}`, x, emY + emH + 38);
        }
        ctx.fillText("Wavelength (nm)", W / 2, emY + emH + 52);

        // Energy level diagram
        if (showLevels) {
            const lvlX = 100, lvlY = 230, lvlW = W - 200, lvlH = 250;
            ctx.fillStyle = "rgba(16,20,58,0.7)";
            ctx.fillRect(lvlX - 40, lvlY, lvlW + 80, lvlH);
            ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(lvlX - 40, lvlY, lvlW + 80, lvlH);

            ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Energy Level Diagram", W / 2, lvlY - 8);

            const minE = data.levels[0];
            const maxE = 0;
            const eRange = maxE - minE;

            // Draw levels
            data.levels.forEach((e, i) => {
                const y = lvlY + lvlH - 20 - ((e - minE) / eRange) * (lvlH - 40);
                ctx.beginPath(); ctx.moveTo(lvlX, y); ctx.lineTo(lvlX + lvlW, y);
                ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.5; ctx.stroke();

                ctx.fillStyle = "#ccc"; ctx.font = "10px sans-serif";
                ctx.textAlign = "right";
                ctx.fillText(`n=${i + 1}`, lvlX - 8, y + 4);
                ctx.textAlign = "left";
                ctx.fillText(`${e.toFixed(2)} eV`, lvlX + lvlW + 8, y + 4);
            });

            // Draw transitions for hydrogen (Balmer series)
            if (elem === "hydrogen") {
                const transitions = [
                    { from: 2, to: 0, wl: 656 },
                    { from: 3, to: 0, wl: 486 },
                    { from: 4, to: 0, wl: 434 },
                    { from: 5, to: 0, wl: 410 }
                ];
                transitions.forEach((tr, i) => {
                    if (tr.from < data.levels.length && tr.to < data.levels.length) {
                        const fromIdx = tr.from;
                        const toIdx = 1; // n=2 for Balmer
                        const y1 = lvlY + lvlH - 20 - ((data.levels[fromIdx] - minE) / eRange) * (lvlH - 40);
                        const y2 = lvlY + lvlH - 20 - ((data.levels[toIdx] - minE) / eRange) * (lvlH - 40);
                        const x = lvlX + 60 + i * 80;
                        ctx.beginPath();
                        ctx.moveTo(x, y1);
                        ctx.lineTo(x, y2);
                        ctx.strokeStyle = wlToRGB(tr.wl);
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        // Arrow
                        ctx.beginPath();
                        ctx.moveTo(x, y2);
                        ctx.lineTo(x - 4, y2 - 8);
                        ctx.lineTo(x + 4, y2 - 8);
                        ctx.closePath();
                        ctx.fillStyle = wlToRGB(tr.wl);
                        ctx.fill();
                        ctx.font = "8px sans-serif"; ctx.textAlign = "center";
                        ctx.fillText(`${tr.wl}nm`, x, (y1 + y2) / 2);
                    }
                });
            }

            // Ionization level
            const ionY = lvlY + 20;
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(lvlX, ionY); ctx.lineTo(lvlX + lvlW, ionY);
            ctx.strokeStyle = "rgba(239, 83, 80, 0.3)"; ctx.lineWidth = 1; ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#ef5350"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Ionization (0 eV)", W / 2, ionY - 5);
        }

        // Bohr model equation
        ctx.fillStyle = "#ccc"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("E_n = -13.6/n\u00b2 eV (hydrogen)  |  \u0394E = hf = hc/\u03bb", W / 2, H - 15);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#64b5f6">Spectral Lines</b><br>` +
            `Element: ${data.name}<br>` +
            `Lines: ${data.lines.length}<br>` +
            `Levels: ${data.levels.length}`;
    }

    document.getElementById("element").addEventListener("change", () => { if (currentSim === "spectral") drawSpectral(); });
    document.getElementById("showELevels").addEventListener("change", () => { if (currentSim === "spectral") drawSpectral(); });
    document.getElementById("btn-spec-reset").addEventListener("click", initSpectral);

    // ═══════════════════════════════════════════════════════
    // 45. COSMIC REDSHIFT
    // ═══════════════════════════════════════════════════════

    function initRedshift() {
        drawRedshift();
    }

    function wlColor(wl) {
        let r = 0, g = 0, b = 0;
        if (wl >= 380 && wl < 440) { r = -(wl - 440) / 60; b = 1; }
        else if (wl >= 440 && wl < 490) { g = (wl - 440) / 50; b = 1; }
        else if (wl >= 490 && wl < 510) { g = 1; b = -(wl - 510) / 20; }
        else if (wl >= 510 && wl < 580) { r = (wl - 510) / 70; g = 1; }
        else if (wl >= 580 && wl < 645) { r = 1; g = -(wl - 645) / 65; }
        else if (wl >= 645 && wl <= 780) { r = 1; }
        else if (wl > 780) { r = 0.7; } // infrared - dark red
        return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
    }

    function drawRedshift() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const v = +document.getElementById("recession").value; // fraction of c
        const origWL = +document.getElementById("origWL").value;

        // Relativistic Doppler: λ_obs = λ_emit * sqrt((1+β)/(1-β))
        const z = Math.sqrt((1 + v) / (1 - v)) - 1;
        const obsWL = origWL * (1 + z);

        // Starfield
        for (let i = 0; i < 100; i++) {
            const sx = (i * 137.5 + 20) % W;
            const sy = (i * 83.3 + i * i * 0.07 + 10) % H;
            ctx.beginPath(); ctx.arc(sx, sy, 0.7, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,200,255,${0.15 + (i % 4) * 0.1})`;
            ctx.fill();
        }

        // Galaxy (emitter) on left
        const galX = 120, galY = H / 2 - 40;
        const galGrad = ctx.createRadialGradient(galX, galY, 5, galX, galY, 50);
        galGrad.addColorStop(0, wlColor(origWL));
        galGrad.addColorStop(0.5, `rgba(200,200,255,0.2)`);
        galGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath(); ctx.arc(galX, galY, 50, 0, Math.PI * 2);
        ctx.fillStyle = galGrad; ctx.fill();
        ctx.beginPath(); ctx.arc(galX, galY, 15, 0, Math.PI * 2);
        ctx.fillStyle = wlColor(origWL); ctx.fill();

        // Velocity arrow
        ctx.beginPath();
        ctx.moveTo(galX + 60, galY);
        ctx.lineTo(galX + 60 + v * 120, galY);
        ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(galX + 60 + v * 120, galY);
        ctx.lineTo(galX + 52 + v * 120, galY - 5);
        ctx.lineTo(galX + 52 + v * 120, galY + 5);
        ctx.closePath();
        ctx.fillStyle = "#ffeb3b"; ctx.fill();
        ctx.fillStyle = "#ffeb3b"; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`v = ${(v * 100).toFixed(0)}% c`, galX + 60 + v * 60, galY - 12);

        // Observer on right
        const obsX = W - 120, obsY = galY;
        ctx.beginPath(); ctx.arc(obsX, obsY, 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(76,175,80,0.3)"; ctx.fill();
        ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#66bb6a"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Observer", obsX, obsY + 34);
        ctx.fillText("\ud83d\udd2d", obsX, obsY + 7);

        // Wave visualization between galaxy and observer
        const waveStartX = galX + 60, waveEndX = obsX - 30;
        const waveLen = waveEndX - waveStartX;
        // Original wave (top)
        const wy1 = galY - 80;
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Emitted", (waveStartX + waveEndX) / 2, wy1 - 25);
        ctx.beginPath();
        for (let x = waveStartX; x <= waveEndX; x++) {
            const y = wy1 + Math.sin((x - waveStartX) / (origWL * 0.15) * Math.PI * 2) * 15;
            x === waveStartX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wlColor(origWL); ctx.lineWidth = 2; ctx.stroke();

        // Observed wave (bottom, stretched)
        const wy2 = galY + 60;
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif";
        ctx.fillText("Observed (redshifted)", (waveStartX + waveEndX) / 2, wy2 - 25);
        ctx.beginPath();
        for (let x = waveStartX; x <= waveEndX; x++) {
            const y = wy2 + Math.sin((x - waveStartX) / (obsWL * 0.15) * Math.PI * 2) * 15;
            x === waveStartX ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = obsWL <= 780 ? wlColor(obsWL) : "#8b0000"; ctx.lineWidth = 2; ctx.stroke();

        // Spectrum comparison
        const specY = H - 200, specH = 30;
        // Original
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Emitted spectrum:", 40, specY - 8);
        for (let x = 60; x < W / 2 - 20; x++) {
            const wl = 380 + ((x - 60) / (W / 2 - 80)) * 400;
            ctx.fillStyle = wlColor(wl);
            ctx.fillRect(x, specY, 1, specH);
        }
        // Emission line
        const origLineX = 60 + ((origWL - 380) / 400) * (W / 2 - 80);
        ctx.fillStyle = "#fff";
        ctx.fillRect(origLineX - 1, specY - 5, 3, specH + 10);
        ctx.fillStyle = wlColor(origWL); ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`${origWL} nm`, origLineX, specY + specH + 14);

        // Observed
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Observed spectrum:", W / 2 + 20, specY - 8);
        for (let x = W / 2 + 40; x < W - 40; x++) {
            const wl = 380 + ((x - (W / 2 + 40)) / (W / 2 - 80)) * 400;
            ctx.fillStyle = wlColor(wl);
            ctx.fillRect(x, specY, 1, specH);
        }
        // Shifted line
        if (obsWL <= 780) {
            const obsLineX = W / 2 + 40 + ((obsWL - 380) / 400) * (W / 2 - 80);
            ctx.fillStyle = "#fff";
            ctx.fillRect(obsLineX - 1, specY - 5, 3, specH + 10);
            ctx.fillStyle = wlColor(obsWL); ctx.font = "9px sans-serif"; ctx.textAlign = "center";
            ctx.fillText(`${obsWL.toFixed(0)} nm`, obsLineX, specY + specH + 14);
        }
        // Arrow between spectra
        ctx.beginPath();
        ctx.moveTo(W / 2 - 15, specY + specH / 2);
        ctx.lineTo(W / 2 + 15, specY + specH / 2);
        ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(W / 2 + 15, specY + specH / 2);
        ctx.lineTo(W / 2 + 8, specY + specH / 2 - 4);
        ctx.lineTo(W / 2 + 8, specY + specH / 2 + 4);
        ctx.closePath(); ctx.fillStyle = "#ffeb3b"; ctx.fill();

        // Hubble's Law info
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(50, H - 75, W - 100, 55);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(50, H - 75, W - 100, 55);

        ctx.fillStyle = "#ccc"; ctx.font = "13px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`z = ${z.toFixed(3)}  |  \u03bb_obs = ${obsWL.toFixed(0)} nm  |  v = ${(v * 100).toFixed(0)}% c`, W / 2, H - 52);
        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif";
        ctx.fillText(`Hubble's Law: v = H\u2080 \u00b7 d  |  Relativistic Doppler: \u03bb_obs = \u03bb_emit \u00b7 \u221a((1+\u03b2)/(1-\u03b2))`, W / 2, H - 32);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#ef5350">Cosmic Redshift</b><br>` +
            `z: ${z.toFixed(3)}<br>` +
            `\u03bb: ${origWL} \u2192 ${obsWL.toFixed(0)} nm<br>` +
            `v: ${(v * 100).toFixed(0)}% c`;
    }

    bindSlider("recession", "val-recession", () => { if (currentSim === "redshift") drawRedshift(); });
    bindSlider("origWL", "val-origWL", () => { if (currentSim === "redshift") drawRedshift(); });
    document.getElementById("btn-rs-reset").addEventListener("click", initRedshift);

    // ═══════════════════════════════════════════════════════
    // 46. QUANTUM HARMONIC OSCILLATOR
    // ═══════════════════════════════════════════════════════

    function initQHO() {
        drawQHO();
    }

    function hermite(n, x) {
        if (n === 0) return 1;
        if (n === 1) return 2 * x;
        let h0 = 1, h1 = 2 * x;
        for (let i = 2; i <= n; i++) {
            const h2 = 2 * x * h1 - 2 * (i - 1) * h0;
            h0 = h1; h1 = h2;
        }
        return h1;
    }

    function factorial(n) {
        let f = 1; for (let i = 2; i <= n; i++) f *= i; return f;
    }

    function psiQHO(n, x) {
        const norm = 1 / Math.sqrt(Math.pow(2, n) * factorial(n) * Math.sqrt(Math.PI));
        return norm * hermite(n, x) * Math.exp(-x * x / 2);
    }

    function drawQHO() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const n = +document.getElementById("qn").value;
        const showProb = document.getElementById("showProb").checked;
        const showClass = document.getElementById("showClassical").checked;

        const cx = W / 2, cy = H / 2;
        const scaleX = 60, scaleY = 150;
        const xRange = 5;

        // Parabolic potential
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
            const x = (px - cx) / scaleX;
            const V = 0.5 * x * x;
            const py = cy + 100 - V * scaleY * 0.3;
            if (py < 20) continue;
            px === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "rgba(120,144,156,0.4)"; ctx.lineWidth = 2; ctx.stroke();

        // Fill potential
        ctx.beginPath();
        ctx.moveTo(0, H);
        for (let px = 0; px < W; px++) {
            const x = (px - cx) / scaleX;
            const V = 0.5 * x * x;
            const py = cy + 100 - V * scaleY * 0.3;
            ctx.lineTo(px, Math.min(H, Math.max(20, py)));
        }
        ctx.lineTo(W, H); ctx.closePath();
        ctx.fillStyle = "rgba(38, 50, 56, 0.2)"; ctx.fill();

        // Energy levels and wavefunctions
        for (let level = 0; level <= Math.min(8, n + 2); level++) {
            const E = level + 0.5;
            const ey = cy + 100 - E * scaleY * 0.3;
            if (ey < 30) continue;

            // Energy level line
            const isActive = level === n;
            ctx.beginPath();
            const turnPt = Math.sqrt(2 * E);
            const tpPx = turnPt * scaleX;
            ctx.moveTo(cx - tpPx - 20, ey);
            ctx.lineTo(cx + tpPx + 20, ey);
            ctx.strokeStyle = isActive ? "rgba(255,235,59,0.6)" : "rgba(255,255,255,0.1)";
            ctx.lineWidth = isActive ? 2 : 1;
            ctx.stroke();

            ctx.fillStyle = isActive ? "#ffeb3b" : "#556";
            ctx.font = isActive ? "bold 11px sans-serif" : "10px sans-serif";
            ctx.textAlign = "right";
            ctx.fillText(`n=${level}`, cx - tpPx - 28, ey + 4);
            ctx.textAlign = "left";
            ctx.fillText(`E=${E.toFixed(1)}\u210f\u03c9`, cx + tpPx + 28, ey + 4);

            // Wavefunction for active level
            if (isActive) {
                const wfScale = 40;

                // Probability density (filled)
                if (showProb) {
                    ctx.beginPath();
                    ctx.moveTo(cx - xRange * scaleX, ey);
                    for (let px = cx - xRange * scaleX; px <= cx + xRange * scaleX; px++) {
                        const x = (px - cx) / scaleX;
                        const psi = psiQHO(n, x);
                        const prob = psi * psi;
                        ctx.lineTo(px, ey - prob * wfScale * wfScale * 2);
                    }
                    ctx.lineTo(cx + xRange * scaleX, ey);
                    ctx.closePath();
                    ctx.fillStyle = "rgba(66, 165, 245, 0.2)";
                    ctx.fill();

                    ctx.beginPath();
                    for (let px = cx - xRange * scaleX; px <= cx + xRange * scaleX; px++) {
                        const x = (px - cx) / scaleX;
                        const psi = psiQHO(n, x);
                        const prob = psi * psi;
                        const py = ey - prob * wfScale * wfScale * 2;
                        px === cx - xRange * scaleX ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                    }
                    ctx.strokeStyle = "#42a5f5"; ctx.lineWidth = 1.5; ctx.stroke();
                }

                // Wavefunction ψ
                ctx.beginPath();
                for (let px = cx - xRange * scaleX; px <= cx + xRange * scaleX; px++) {
                    const x = (px - cx) / scaleX;
                    const psi = psiQHO(n, x);
                    const py = ey - psi * wfScale;
                    px === cx - xRange * scaleX ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                ctx.strokeStyle = "#66bb6a"; ctx.lineWidth = 2; ctx.stroke();

                // Classical turning points
                if (showClass) {
                    ctx.setLineDash([4, 4]);
                    [-turnPt, turnPt].forEach(tp => {
                        const tpx = cx + tp * scaleX;
                        ctx.beginPath();
                        ctx.moveTo(tpx, ey - 60);
                        ctx.lineTo(tpx, ey + 20);
                        ctx.strokeStyle = "rgba(239, 83, 80, 0.5)";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    });
                    ctx.setLineDash([]);
                    ctx.fillStyle = "#ef5350"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
                    ctx.fillText("Classical", cx + turnPt * scaleX, ey + 30);
                    ctx.fillText("turning point", cx + turnPt * scaleX, ey + 42);
                }
            }
        }

        // Labels
        ctx.fillStyle = "#ccc"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("V(x) = \u00bdm\u03c9\u00b2x\u00b2", W / 2, H - 55);
        ctx.fillText(`E_n = (n + \u00bd)\u210f\u03c9  |  n = ${n}  |  E = ${(n + 0.5).toFixed(1)}\u210f\u03c9`, W / 2, H - 35);

        // Legend
        ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = "#66bb6a"; ctx.fillText("\u2014 \u03c8(x) wavefunction", 30, H - 15);
        ctx.fillStyle = "#42a5f5"; ctx.fillText("\u2014 |\u03c8|\u00b2 probability density", 200, H - 15);
        ctx.fillStyle = "#ef5350"; ctx.fillText("\u2014 Classical turning points", 420, H - 15);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#66bb6a">Quantum HO</b><br>` +
            `n: ${n}<br>` +
            `E: ${(n + 0.5).toFixed(1)}\u210f\u03c9<br>` +
            `Nodes: ${n}`;
    }

    bindSlider("qn", "val-qn", () => { if (currentSim === "qho") drawQHO(); });
    document.getElementById("showProb").addEventListener("change", () => { if (currentSim === "qho") drawQHO(); });
    document.getElementById("showClassical").addEventListener("change", () => { if (currentSim === "qho") drawQHO(); });
    document.getElementById("btn-qho-reset").addEventListener("click", initQHO);

    // ═══════════════════════════════════════════════════════
    // 47. TECTONIC PLATES
    // ═══════════════════════════════════════════════════════
    let tectState = { t: 0, running: true, quakes: [] };

    function initTectonic() {
        tectState = { t: 0, running: true, quakes: [] };
        document.getElementById("btn-tect-toggle").textContent = "Pause";
        drawTectonic();
    }

    function drawTectonic() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const speed = +document.getElementById("plateSpeed").value;
        const boundary = document.getElementById("boundaryType").value;

        if (tectState.running) {
            tectState.t += 0.016 * speed;
            // Random earthquake
            if (Math.random() < 0.01 * speed) {
                tectState.quakes.push({
                    x: W / 2 + (Math.random() - 0.5) * 60,
                    y: H / 2 + (Math.random() - 0.5) * 40,
                    r: 0, maxR: 30 + Math.random() * 40,
                    mag: (3 + Math.random() * 4).toFixed(1)
                });
            }
            tectState.quakes.forEach(q => { q.r += 1.5; });
            tectState.quakes = tectState.quakes.filter(q => q.r < q.maxR);
        }

        const cx = W / 2, cy = H / 2 + 30;

        // Cross-section view
        // Atmosphere/Ocean top
        ctx.fillStyle = "rgba(100, 149, 237, 0.15)";
        ctx.fillRect(0, 0, W, 80);

        if (boundary === "divergent") {
            // Mid-ocean ridge
            const offset = tectState.t * 5;

            // Mantle (deep)
            ctx.fillStyle = "rgba(183, 28, 28, 0.3)";
            ctx.fillRect(0, cy + 80, W, H - cy - 80);
            ctx.fillStyle = "#b71c1c"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Mantle (Asthenosphere)", cx, H - 20);

            // Left plate
            ctx.fillStyle = "rgba(62, 39, 35, 0.6)";
            ctx.fillRect(0, 80, cx - 20 - offset * 0.5, cy - 80);
            // Right plate
            ctx.fillRect(cx + 20 + offset * 0.5, 80, W, cy - 80);

            // Oceanic crust on plates
            ctx.fillStyle = "rgba(78, 52, 46, 0.8)";
            ctx.fillRect(0, 80, cx - 20 - offset * 0.5, 20);
            ctx.fillRect(cx + 20 + offset * 0.5, 80, W, 20);

            // Ridge
            ctx.beginPath();
            ctx.moveTo(cx - 30 - offset * 0.5, 80);
            ctx.lineTo(cx, 40);
            ctx.lineTo(cx + 30 + offset * 0.5, 80);
            ctx.fillStyle = "rgba(183, 28, 28, 0.5)";
            ctx.fill();

            // Magma rising
            for (let i = 0; i < 6; i++) {
                const my = cy + 80 - (tectState.t * 30 + i * 30) % 120;
                const mx = cx + Math.sin(i * 2 + tectState.t) * 8;
                ctx.beginPath(); ctx.arc(mx, my, 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, ${100 + i * 20}, 0, ${0.6 - i * 0.08})`;
                ctx.fill();
            }

            // Plate arrows
            ctx.beginPath(); ctx.moveTo(cx - 80, cy - 30); ctx.lineTo(cx - 150, cy - 30);
            ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 3; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx + 80, cy - 30); ctx.lineTo(cx + 150, cy - 30);
            ctx.stroke();

            ctx.fillStyle = "#ffeb3b"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Plate A \u2190", cx - 115, cy - 40);
            ctx.fillText("\u2192 Plate B", cx + 115, cy - 40);

            // New crust
            ctx.fillStyle = "rgba(255, 87, 34, 0.6)";
            ctx.fillRect(cx - 15, 50, 30, 30);
            ctx.fillStyle = "#ff5722"; ctx.font = "9px sans-serif";
            ctx.fillText("New crust", cx, 48);

            ctx.fillStyle = "#aab"; ctx.font = "bold 14px sans-serif";
            ctx.fillText("Divergent Boundary (Mid-Ocean Ridge)", cx, 24);

        } else if (boundary === "convergent") {
            // Subduction zone
            const offset = tectState.t * 3;

            // Mantle
            ctx.fillStyle = "rgba(183, 28, 28, 0.3)";
            ctx.fillRect(0, cy + 60, W, H - cy - 60);

            // Overriding plate (continental, thicker, left)
            ctx.fillStyle = "rgba(139, 119, 101, 0.7)";
            ctx.beginPath();
            ctx.moveTo(0, 80);
            ctx.lineTo(cx + 30, 80);
            ctx.lineTo(cx + 20, cy + 60);
            ctx.lineTo(0, cy + 60);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = "#8d6e63"; ctx.fillRect(0, 70, cx + 30, 15);

            // Mountains at convergent zone
            for (let i = 0; i < 4; i++) {
                const mx = cx - 10 + i * 25;
                const mh = 25 + Math.sin(i * 1.5) * 10;
                ctx.beginPath();
                ctx.moveTo(mx - 15, 70);
                ctx.lineTo(mx, 70 - mh);
                ctx.lineTo(mx + 15, 70);
                ctx.closePath();
                ctx.fillStyle = `rgba(121, 85, 72, ${0.7 + i * 0.05})`;
                ctx.fill();
            }
            // Snow caps
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            for (let i = 0; i < 4; i++) {
                const mx = cx - 10 + i * 25;
                const mh = 25 + Math.sin(i * 1.5) * 10;
                ctx.beginPath();
                ctx.moveTo(mx - 5, 70 - mh + 5);
                ctx.lineTo(mx, 70 - mh);
                ctx.lineTo(mx + 5, 70 - mh + 5);
                ctx.closePath();
                ctx.fill();
            }

            // Subducting plate (oceanic, thinner, right)
            ctx.beginPath();
            ctx.moveTo(cx + 30, 100);
            ctx.lineTo(W, 100);
            ctx.lineTo(W, 120);
            ctx.lineTo(cx + 30, 120);
            // Curve down into mantle
            ctx.quadraticCurveTo(cx - 40, cy + 80, cx - 80, H);
            ctx.quadraticCurveTo(cx - 60, cy + 60, cx + 10, 100);
            ctx.closePath();
            ctx.fillStyle = "rgba(62, 39, 35, 0.6)";
            ctx.fill();

            // Trench
            ctx.beginPath();
            ctx.moveTo(cx + 20, 100);
            ctx.quadraticCurveTo(cx + 35, 130, cx + 50, 100);
            ctx.strokeStyle = "#1565c0"; ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = "#42a5f5"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Trench", cx + 35, 142);

            // Volcano
            const volX = cx - 30, volY = 70;
            ctx.beginPath();
            ctx.moveTo(volX - 20, volY); ctx.lineTo(volX, volY - 30); ctx.lineTo(volX + 20, volY);
            ctx.closePath();
            ctx.fillStyle = "#795548"; ctx.fill();
            // Eruption particles
            if (tectState.running) {
                for (let i = 0; i < 4; i++) {
                    const py = volY - 35 - (tectState.t * 20 + i * 15) % 40;
                    const px = volX + Math.sin(tectState.t * 3 + i) * 6;
                    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, ${150 - i * 30}, 0, ${0.7 - i * 0.15})`;
                    ctx.fill();
                }
            }

            // Arrows
            ctx.beginPath(); ctx.moveTo(W - 80, 110); ctx.lineTo(cx + 60, 110);
            ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = "#ffeb3b"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Oceanic plate \u2192", W - 150, 98);
            ctx.fillText("Continental plate", cx / 2, 95);

            ctx.fillStyle = "#aab"; ctx.font = "bold 14px sans-serif";
            ctx.fillText("Convergent Boundary (Subduction Zone)", cx, 24);

        } else {
            // Transform boundary
            const offset = Math.sin(tectState.t * 2) * 15;

            // Two plates side by side
            ctx.fillStyle = "rgba(62, 39, 35, 0.5)";
            ctx.fillRect(0, 80, W, cy - 80);

            // Fault line
            ctx.beginPath();
            ctx.moveTo(cx, 80);
            ctx.lineTo(cx, cy + 60);
            ctx.strokeStyle = "#ef5350"; ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);

            // Offset features to show movement
            ctx.fillStyle = "rgba(76, 175, 80, 0.4)";
            ctx.fillRect(cx - 100, cy - 40 + offset, 98, 20);
            ctx.fillRect(cx + 2, cy - 40 - offset, 98, 20);
            ctx.fillStyle = "#66bb6a"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Feature A", cx - 50, cy - 44 + offset);
            ctx.fillText("Feature A (offset)", cx + 50, cy - 44 - offset);

            // Arrows
            ctx.beginPath(); ctx.moveTo(cx - 150, cy - 10); ctx.lineTo(cx - 50, cy - 10);
            ctx.strokeStyle = "#ffeb3b"; ctx.lineWidth = 2; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx + 50, cy + 10); ctx.lineTo(cx + 150, cy + 10);
            ctx.stroke();

            // Mantle below
            ctx.fillStyle = "rgba(183, 28, 28, 0.2)";
            ctx.fillRect(0, cy + 60, W, H - cy - 60);

            ctx.fillStyle = "#aab"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
            ctx.fillText("Transform Boundary (Strike-Slip Fault)", cx, 24);
            ctx.fillStyle = "#ef5350"; ctx.font = "11px sans-serif";
            ctx.fillText("San Andreas Fault type", cx, H - 70);
        }

        // Earthquake ripples
        tectState.quakes.forEach(q => {
            ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 235, 59, ${1 - q.r / q.maxR})`;
            ctx.lineWidth = 2; ctx.stroke();
            ctx.fillStyle = `rgba(255, 235, 59, ${0.8 - q.r / q.maxR})`;
            ctx.font = "9px sans-serif"; ctx.textAlign = "center";
            ctx.fillText(`M${q.mag}`, q.x, q.y - q.r - 5);
        });

        // Layer labels
        ctx.fillStyle = "rgba(16,20,58,0.8)";
        ctx.fillRect(W - 170, H - 80, 155, 65);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(W - 170, H - 80, 155, 65);
        ctx.font = "10px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = "#90caf9"; ctx.fillText("Ocean / Atmosphere", W - 160, H - 62);
        ctx.fillStyle = "#8d6e63"; ctx.fillText("Crust (Lithosphere)", W - 160, H - 46);
        ctx.fillStyle = "#ef5350"; ctx.fillText("Mantle (Asthenosphere)", W - 160, H - 30);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#8d6e63">Tectonic Plates</b><br>` +
            `Type: ${boundary}<br>` +
            `Speed: ${speed}x<br>` +
            `Quakes: ${tectState.quakes.length}`;

        if (tectState.running) {
            animId = requestAnimationFrame(drawTectonic);
        }
    }

    bindSlider("plateSpeed", "val-plateSpeed");
    document.getElementById("boundaryType").addEventListener("change", () => { if (currentSim === "tectonic") { tectState.quakes = []; } });

    document.getElementById("btn-tect-toggle").addEventListener("click", () => {
        tectState.running = !tectState.running;
        document.getElementById("btn-tect-toggle").textContent = tectState.running ? "Pause" : "Resume";
        if (tectState.running) drawTectonic();
    });
    document.getElementById("btn-tect-reset").addEventListener("click", initTectonic);

    // ═══════════════════════════════════════════════════════
    // 48. ACID-BASE TITRATION
    // ═══════════════════════════════════════════════════════
    let titrState = {};

    function initTitration() {
        titrState = { baseAdded: 0, history: [], autoMode: false };
        drawTitration();
    }

    function calcPH(acidConc, baseConc, baseVol, acidVol, isWeak) {
        const molesAcid = acidConc * acidVol;
        const molesBase = baseConc * baseVol;
        const totalVol = acidVol + baseVol;

        if (molesBase < molesAcid) {
            const excessAcid = (molesAcid - molesBase) / totalVol;
            if (isWeak) {
                const Ka = 1.8e-5; // acetic acid
                return -Math.log10((-Ka + Math.sqrt(Ka * Ka + 4 * Ka * excessAcid)) / 2);
            }
            return -Math.log10(excessAcid);
        } else if (Math.abs(molesBase - molesAcid) < 0.0001) {
            return isWeak ? 8.7 : 7; // equivalence point
        } else {
            const excessBase = (molesBase - molesAcid) / totalVol;
            return 14 + Math.log10(excessBase);
        }
    }

    function drawTitration() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const acidConc = +document.getElementById("acidConc").value;
        const baseConc = +document.getElementById("baseConc").value;
        const isWeak = document.getElementById("acidType").value === "weak";
        const acidVol = 0.050; // 50 mL fixed
        const baseVol = titrState.baseAdded / 1000;

        const pH = calcPH(acidConc, baseConc, baseVol, acidVol, isWeak);

        if (titrState.autoMode && titrState.baseAdded < 120) {
            titrState.baseAdded += 0.3;
            const newpH = calcPH(acidConc, baseConc, titrState.baseAdded / 1000, acidVol, isWeak);
            titrState.history.push({ vol: titrState.baseAdded, pH: newpH });
        }

        // Beaker
        const bkX = 80, bkY = 100, bkW = 180, bkH = 280;
        ctx.beginPath();
        ctx.moveTo(bkX, bkY);
        ctx.lineTo(bkX, bkY + bkH);
        ctx.lineTo(bkX + bkW, bkY + bkH);
        ctx.lineTo(bkX + bkW, bkY);
        ctx.strokeStyle = "rgba(200,200,220,0.5)"; ctx.lineWidth = 3; ctx.stroke();

        // Liquid with pH-dependent color
        const fillH = bkH * 0.75 + baseVol * 300;
        let liquidColor;
        if (pH < 3) liquidColor = "rgba(239, 83, 80, 0.5)";
        else if (pH < 5) liquidColor = "rgba(255, 152, 0, 0.4)";
        else if (pH < 6.5) liquidColor = "rgba(255, 235, 59, 0.4)";
        else if (pH < 7.5) liquidColor = "rgba(76, 175, 80, 0.4)";
        else if (pH < 9) liquidColor = "rgba(66, 165, 245, 0.4)";
        else if (pH < 11) liquidColor = "rgba(63, 81, 181, 0.4)";
        else liquidColor = "rgba(103, 58, 183, 0.5)";

        ctx.fillStyle = liquidColor;
        ctx.fillRect(bkX + 3, bkY + bkH - Math.min(fillH, bkH - 5), bkW - 6, Math.min(fillH, bkH - 5) - 3);

        // Indicator color strip
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(bkX, bkY + bkH + 15, bkW, 25);
        const phColors = [
            "#ff1744", "#ff5252", "#ff9800", "#ffc107", "#ffeb3b",
            "#cddc39", "#4caf50", "#009688", "#00bcd4", "#2196f3",
            "#3f51b5", "#673ab7", "#9c27b0", "#e91e63"
        ];
        const phStep = bkW / 14;
        for (let i = 0; i < 14; i++) {
            ctx.fillStyle = phColors[i];
            ctx.fillRect(bkX + i * phStep, bkY + bkH + 15, phStep, 25);
        }
        // pH marker
        const markerX = bkX + (pH / 14) * bkW;
        ctx.beginPath();
        ctx.moveTo(markerX, bkY + bkH + 12);
        ctx.lineTo(markerX - 5, bkY + bkH + 6);
        ctx.lineTo(markerX + 5, bkY + bkH + 6);
        ctx.closePath();
        ctx.fillStyle = "#fff"; ctx.fill();

        ctx.fillStyle = "#ccc"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        for (let i = 0; i <= 14; i += 2) {
            ctx.fillText(`${i}`, bkX + (i / 14) * bkW, bkY + bkH + 52);
        }
        ctx.fillText("pH Scale", bkX + bkW / 2, bkY + bkH + 66);

        // Burette above
        ctx.fillStyle = "rgba(200,200,220,0.3)";
        ctx.fillRect(bkX + bkW / 2 - 8, 10, 16, 85);
        ctx.strokeStyle = "rgba(200,200,220,0.5)"; ctx.lineWidth = 1;
        ctx.strokeRect(bkX + bkW / 2 - 8, 10, 16, 85);
        // Drops
        if (titrState.autoMode) {
            const dropY = bkY - 5 + (Math.sin(titrState.baseAdded * 0.5) * 0.5 + 0.5) * 10;
            ctx.beginPath(); ctx.arc(bkX + bkW / 2, dropY, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(63, 81, 181, 0.7)"; ctx.fill();
        }
        ctx.fillStyle = "#7986cb"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("NaOH", bkX + bkW / 2, 8);

        // pH display
        ctx.fillStyle = "#ffeb3b"; ctx.font = "bold 24px sans-serif";
        ctx.fillText(`pH ${pH.toFixed(2)}`, bkX + bkW / 2, bkY + bkH / 2);
        ctx.fillStyle = "#ccc"; ctx.font = "11px sans-serif";
        ctx.fillText(`${titrState.baseAdded.toFixed(1)} mL NaOH added`, bkX + bkW / 2, bkY + bkH / 2 + 20);

        // Titration curve
        const gx = 320, gy = 40, gw = W - 360, gh = H - 100;
        ctx.fillStyle = "rgba(16,20,58,0.7)";
        ctx.fillRect(gx, gy, gw, gh);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(gx, gy, gw, gh);

        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("Titration Curve", gx + 8, gy - 6);

        // Y-axis (pH 0-14)
        ctx.fillStyle = "#556"; ctx.font = "9px sans-serif"; ctx.textAlign = "right";
        for (let ph = 0; ph <= 14; ph += 2) {
            const py = gy + gh - (ph / 14) * gh;
            ctx.fillText(`${ph}`, gx - 4, py + 4);
            ctx.beginPath(); ctx.moveTo(gx, py); ctx.lineTo(gx + gw, py);
            ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1; ctx.stroke();
        }

        // pH 7 line
        const ph7Y = gy + gh - (7 / 14) * gh;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(gx, ph7Y); ctx.lineTo(gx + gw, ph7Y);
        ctx.strokeStyle = "rgba(76,175,80,0.3)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#66bb6a"; ctx.font = "9px sans-serif"; ctx.textAlign = "left";
        ctx.fillText("pH 7 (neutral)", gx + 4, ph7Y - 4);

        // Theoretical curve
        ctx.beginPath();
        const maxVol = 120;
        for (let v2 = 0; v2 <= maxVol; v2 += 0.5) {
            const theorPH = calcPH(acidConc, baseConc, v2 / 1000, acidVol, isWeak);
            const px = gx + (v2 / maxVol) * gw;
            const py = gy + gh - (Math.max(0, Math.min(14, theorPH)) / 14) * gh;
            v2 === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1; ctx.stroke();

        // Actual data
        if (titrState.history.length > 1) {
            ctx.beginPath();
            titrState.history.forEach((h, i) => {
                const px = gx + (h.vol / maxVol) * gw;
                const py = gy + gh - (Math.max(0, Math.min(14, h.pH)) / 14) * gh;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.strokeStyle = "#ff9800"; ctx.lineWidth = 2.5; ctx.stroke();
        }

        // Current point
        const cpx = gx + (titrState.baseAdded / maxVol) * gw;
        const cpy = gy + gh - (Math.max(0, Math.min(14, pH)) / 14) * gh;
        ctx.beginPath(); ctx.arc(cpx, cpy, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffeb3b"; ctx.fill();

        // Equivalence point marker
        const eqVol = (acidConc * acidVol * 1000) / baseConc;
        const eqX = gx + (eqVol / maxVol) * gw;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(eqX, gy); ctx.lineTo(eqX, gy + gh);
        ctx.strokeStyle = "rgba(239,83,80,0.4)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#ef5350"; ctx.font = "9px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(`Equiv. pt (${eqVol.toFixed(1)} mL)`, eqX, gy + gh + 14);

        // X-axis label
        ctx.fillStyle = "#aab"; ctx.font = "10px sans-serif";
        ctx.fillText("Volume of NaOH added (mL)", gx + gw / 2, gy + gh + 30);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#ff9800">Titration</b><br>` +
            `pH: ${pH.toFixed(2)}<br>` +
            `Base: ${titrState.baseAdded.toFixed(1)} mL<br>` +
            `${isWeak ? "Weak" : "Strong"} acid`;

        if (titrState.autoMode && titrState.baseAdded < 120) {
            animId = requestAnimationFrame(drawTitration);
        }
    }

    bindSlider("acidConc", "val-acidConc", () => { if (currentSim === "titration") { titrState.history = []; titrState.baseAdded = 0; drawTitration(); } });
    bindSlider("baseConc", "val-baseConc", () => { if (currentSim === "titration") { titrState.history = []; titrState.baseAdded = 0; drawTitration(); } });
    document.getElementById("acidType").addEventListener("change", () => { if (currentSim === "titration") { titrState.history = []; titrState.baseAdded = 0; drawTitration(); } });

    document.getElementById("btn-titr-add").addEventListener("click", () => {
        titrState.baseAdded += 2;
        const acidConc = +document.getElementById("acidConc").value;
        const baseConc = +document.getElementById("baseConc").value;
        const isWeak = document.getElementById("acidType").value === "weak";
        const pH = calcPH(acidConc, baseConc, titrState.baseAdded / 1000, 0.050, isWeak);
        titrState.history.push({ vol: titrState.baseAdded, pH });
        drawTitration();
    });
    document.getElementById("btn-titr-auto").addEventListener("click", () => {
        titrState.autoMode = !titrState.autoMode;
        document.getElementById("btn-titr-auto").textContent = titrState.autoMode ? "Stop" : "Auto-Titrate";
        if (titrState.autoMode) drawTitration();
    });
    document.getElementById("btn-titr-reset").addEventListener("click", () => {
        titrState.autoMode = false;
        document.getElementById("btn-titr-auto").textContent = "Auto-Titrate";
        initTitration();
    });

    // ═══════════════════════════════════════════════════════
    // 49. LORENZ ATTRACTOR
    // ═══════════════════════════════════════════════════════
    let lorState = {};

    function initLorenz() {
        lorState = {
            x: 1, y: 1, z: 1,
            trail: [],
            running: true,
            t: 0
        };
        document.getElementById("btn-lor-toggle").textContent = "Pause";
        drawLorenz();
    }

    function drawLorenz() {
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);

        const sigma = +document.getElementById("sigma").value;
        const rho = +document.getElementById("rho").value;
        const beta = +document.getElementById("betaL").value;
        const dt = 0.005;

        if (lorState.running) {
            for (let i = 0; i < 10; i++) {
                const dx = sigma * (lorState.y - lorState.x);
                const dy = lorState.x * (rho - lorState.z) - lorState.y;
                const dz = lorState.x * lorState.y - beta * lorState.z;
                lorState.x += dx * dt;
                lorState.y += dy * dt;
                lorState.z += dz * dt;
                lorState.t += dt;
                lorState.trail.push({ x: lorState.x, y: lorState.y, z: lorState.z });
            }
            if (lorState.trail.length > 5000) lorState.trail.splice(0, 50);
        }

        // Project 3D to 2D (XZ view)
        const cx = W / 2, cy = H / 2 + 40;
        const scaleXZ = 8, scaleY2 = 6;

        // XZ projection (main view)
        if (lorState.trail.length > 2) {
            for (let i = 1; i < lorState.trail.length; i++) {
                const p1 = lorState.trail[i - 1];
                const p2 = lorState.trail[i];
                const px1 = cx + p1.x * scaleXZ;
                const py1 = cy - p1.z * scaleY2 + 100;
                const px2 = cx + p2.x * scaleXZ;
                const py2 = cy - p2.z * scaleY2 + 100;

                const alpha = i / lorState.trail.length;
                const hue = (i / lorState.trail.length) * 280;
                ctx.beginPath();
                ctx.moveTo(px1, py1);
                ctx.lineTo(px2, py2);
                ctx.strokeStyle = `hsla(${hue}, 80%, 55%, ${alpha * 0.8})`;
                ctx.lineWidth = 1 + alpha;
                ctx.stroke();
            }

            // Current point
            const last = lorState.trail[lorState.trail.length - 1];
            const lpx = cx + last.x * scaleXZ;
            const lpy = cy - last.z * scaleY2 + 100;
            const pGrad = ctx.createRadialGradient(lpx, lpy, 2, lpx, lpy, 10);
            pGrad.addColorStop(0, "#fff");
            pGrad.addColorStop(1, "rgba(255,255,255,0)");
            ctx.beginPath(); ctx.arc(lpx, lpy, 10, 0, Math.PI * 2);
            ctx.fillStyle = pGrad; ctx.fill();
            ctx.beginPath(); ctx.arc(lpx, lpy, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#fff"; ctx.fill();
        }

        // Fixed points
        const fp1x = cx + Math.sqrt(beta * (rho - 1)) * scaleXZ;
        const fp1y = cy - (rho - 1) * scaleY2 + 100;
        const fp2x = cx - Math.sqrt(beta * (rho - 1)) * scaleXZ;
        const fp2y = fp1y;
        if (rho > 1) {
            ctx.beginPath(); ctx.arc(fp1x, fp1y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(239,83,80,0.5)"; ctx.fill();
            ctx.beginPath(); ctx.arc(fp2x, fp2y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(239,83,80,0.5)"; ctx.fill();
        }

        // Axes
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx - 200, cy + 100); ctx.lineTo(cx + 200, cy + 100); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, cy + 200); ctx.lineTo(cx, cy - 200); ctx.stroke();
        ctx.fillStyle = "#556"; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("x", cx + 210, cy + 105);
        ctx.fillText("z", cx + 10, cy - 205);

        // Title
        ctx.fillStyle = "#7b61ff"; ctx.font = "bold 16px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("Lorenz Attractor", cx, 24);
        ctx.fillStyle = "#aab"; ctx.font = "11px sans-serif";
        ctx.fillText("\"The Butterfly Effect\"", cx, 42);

        // Equations
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(20, H - 85, 280, 70);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(20, H - 85, 280, 70);
        ctx.fillStyle = "#ccc"; ctx.font = "12px monospace"; ctx.textAlign = "left";
        ctx.fillText(`dx/dt = \u03c3(y - x)`, 30, H - 65);
        ctx.fillText(`dy/dt = x(\u03c1 - z) - y`, 30, H - 47);
        ctx.fillText(`dz/dt = xy - \u03b2z`, 30, H - 29);

        // Parameters
        ctx.fillStyle = "rgba(16,20,58,0.85)";
        ctx.fillRect(W - 200, H - 85, 185, 70);
        ctx.strokeStyle = "#2a2f6e"; ctx.strokeRect(W - 200, H - 85, 185, 70);
        ctx.fillStyle = "#ffeb3b"; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
        ctx.fillText(`\u03c3 = ${sigma}`, W - 190, H - 65);
        ctx.fillText(`\u03c1 = ${rho}`, W - 190, H - 47);
        ctx.fillText(`\u03b2 = ${beta}`, W - 190, H - 29);
        ctx.fillStyle = "#aab";
        ctx.fillText(`x: ${lorState.x.toFixed(2)}`, W - 120, H - 65);
        ctx.fillText(`y: ${lorState.y.toFixed(2)}`, W - 120, H - 47);
        ctx.fillText(`z: ${lorState.z.toFixed(2)}`, W - 120, H - 29);

        ctx.textAlign = "start";
        overlay.innerHTML =
            `<b style="color:#7b61ff">Lorenz Attractor</b><br>` +
            `\u03c3: ${sigma} | \u03c1: ${rho} | \u03b2: ${beta}<br>` +
            `Points: ${lorState.trail.length}<br>` +
            `t: ${lorState.t.toFixed(1)}`;

        if (lorState.running) {
            animId = requestAnimationFrame(drawLorenz);
        }
    }

    bindSlider("sigma", "val-sigma", () => { if (currentSim === "lorenz") { lorState.trail = []; lorState.x = 1; lorState.y = 1; lorState.z = 1; } });
    bindSlider("rho", "val-rho", () => { if (currentSim === "lorenz") { lorState.trail = []; lorState.x = 1; lorState.y = 1; lorState.z = 1; } });
    bindSlider("betaL", "val-betaL", () => { if (currentSim === "lorenz") { lorState.trail = []; lorState.x = 1; lorState.y = 1; lorState.z = 1; } });

    document.getElementById("btn-lor-toggle").addEventListener("click", () => {
        lorState.running = !lorState.running;
        document.getElementById("btn-lor-toggle").textContent = lorState.running ? "Pause" : "Resume";
        if (lorState.running) drawLorenz();
    });
    document.getElementById("btn-lor-reset").addEventListener("click", initLorenz);

    // ── 50. Fourier Series ─────────────────────────────────
    let fourState = {};
    function initFourier() {
        cancelAnimationFrame(animId);
        currentSim = "fourier";
        fourState = { t: 0 };
        drawFourier();
    }
    function drawFourier() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const wave = document.getElementById("sel-fourier-wave").value;
        const N = parseInt(document.getElementById("harmonics").value);
        const speed = parseFloat(document.getElementById("four-speed").value);
        fourState.t += 0.02 * speed;

        const cx = 200, cy = H / 2, R = 80;
        const trace = [];

        // Draw epicycles
        let x = cx, y = cy;
        for (let n = 0; n < N; n++) {
            let k, amp;
            if (wave === "square") {
                k = 2 * n + 1;
                amp = R * (4 / (Math.PI * k));
            } else if (wave === "sawtooth") {
                k = n + 1;
                amp = R * (2 / (Math.PI * k)) * (k % 2 === 0 ? 1 : -1) * -1;
            } else {
                k = 2 * n + 1;
                amp = R * (8 / (Math.PI * Math.PI * k * k)) * (n % 2 === 0 ? 1 : -1);
            }
            const prevX = x, prevY = y;
            ctx.beginPath();
            ctx.arc(prevX, prevY, Math.abs(amp), 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${(n / N) * 360}, 70%, 60%, 0.3)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            x += amp * Math.cos(k * fourState.t);
            y += amp * Math.sin(k * fourState.t);
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `hsla(${(n / N) * 360}, 70%, 70%, 0.7)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Dot at tip
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();

        // Draw waveform on the right
        const waveStartX = 350;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(waveStartX, y);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        for (let px = 0; px < W - waveStartX; px++) {
            const tOff = fourState.t - px * 0.02;
            let val = 0;
            for (let n = 0; n < N; n++) {
                let k2, amp2;
                if (wave === "square") {
                    k2 = 2 * n + 1;
                    amp2 = 4 / (Math.PI * k2);
                } else if (wave === "sawtooth") {
                    k2 = n + 1;
                    amp2 = (2 / (Math.PI * k2)) * (k2 % 2 === 0 ? 1 : -1) * -1;
                } else {
                    k2 = 2 * n + 1;
                    amp2 = (8 / (Math.PI * Math.PI * k2 * k2)) * (n % 2 === 0 ? 1 : -1);
                }
                val += amp2 * Math.sin(k2 * tOff);
            }
            const py = cy + val * R;
            if (px === 0) ctx.moveTo(waveStartX + px, py);
            else ctx.lineTo(waveStartX + px, py);
        }
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Target waveform (faint)
        ctx.beginPath();
        for (let px = 0; px < W - waveStartX; px++) {
            const tOff = fourState.t - px * 0.02;
            let val;
            const phase = tOff % (Math.PI * 2);
            if (wave === "square") val = phase > 0 && phase < Math.PI ? 1 : -1;
            else if (wave === "sawtooth") val = 1 - phase / Math.PI;
            else val = 2 * Math.abs(2 * (phase / (2 * Math.PI) - Math.floor(phase / (2 * Math.PI) + 0.5))) - 1;
            const py = cy + val * R;
            if (px === 0) ctx.moveTo(waveStartX + px, py);
            else ctx.lineTo(waveStartX + px, py);
        }
        ctx.strokeStyle = "rgba(255,100,100,0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        overlay.innerHTML =
            `<b style="color:#00e5ff">Fourier Series</b><br>` +
            `Waveform: ${wave}<br>` +
            `Harmonics: ${N}`;

        animId = requestAnimationFrame(drawFourier);
    }
    bindSlider("harmonics", "val-harmonics");
    bindSlider("four-speed", "val-four-speed");

    // ── 51. Galton Board ─────────────────────────────────────
    let galtonState = {};
    function initGalton() {
        cancelAnimationFrame(animId);
        currentSim = "galton";
        const rows = parseInt(document.getElementById("galton-rows").value);
        galtonState = {
            rows: rows,
            balls: [],
            bins: new Array(rows + 1).fill(0),
            lastSpawn: 0,
            maxBin: 0
        };
        drawGalton();
    }
    function drawGalton() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const rows = parseInt(document.getElementById("galton-rows").value);
        const rate = parseInt(document.getElementById("galton-rate").value);
        const bias = parseFloat(document.getElementById("galton-bias").value);

        if (galtonState.rows !== rows) {
            galtonState.rows = rows;
            galtonState.bins = new Array(rows + 1).fill(0);
            galtonState.balls = [];
            galtonState.maxBin = 0;
        }

        const pegSpacing = Math.min(35, (W - 100) / (rows + 1));
        const pegStartY = 60;
        const pegEndY = pegStartY + rows * pegSpacing;
        const boardCX = W / 2;

        // Draw pegs
        for (let r = 0; r < rows; r++) {
            const numPegs = r + 1;
            const rowY = pegStartY + r * pegSpacing;
            for (let p = 0; p < numPegs; p++) {
                const px = boardCX + (p - r / 2) * pegSpacing;
                ctx.beginPath();
                ctx.arc(px, rowY, 3, 0, Math.PI * 2);
                ctx.fillStyle = "#667";
                ctx.fill();
            }
        }

        // Spawn balls
        const now = Date.now();
        if (now - galtonState.lastSpawn > 1000 / rate) {
            galtonState.lastSpawn = now;
            // Pre-compute path through pegs
            let ballBin = 0;
            const path = [{ x: boardCX, y: pegStartY - 20 }];
            let bx = boardCX;
            for (let r = 0; r < rows; r++) {
                const goRight = Math.random() < bias;
                if (goRight) ballBin++;
                bx += (goRight ? 0.5 : -0.5) * pegSpacing;
                path.push({ x: bx, y: pegStartY + r * pegSpacing });
            }
            path.push({ x: bx, y: pegEndY + 30 });
            galtonState.balls.push({
                path: path,
                progress: 0,
                bin: ballBin,
                settled: false,
                hue: Math.random() * 360
            });
        }

        // Update and draw balls
        const binWidth = pegSpacing * 0.9;
        const binBaseY = H - 20;
        for (let i = galtonState.balls.length - 1; i >= 0; i--) {
            const ball = galtonState.balls[i];
            if (!ball.settled) {
                ball.progress += 0.04;
                if (ball.progress >= ball.path.length - 1) {
                    ball.settled = true;
                    galtonState.bins[ball.bin]++;
                    galtonState.maxBin = Math.max(galtonState.maxBin, galtonState.bins[ball.bin]);
                }
            }
            let bx2, by2;
            if (ball.settled) {
                const binX = boardCX + (ball.bin - rows / 2) * pegSpacing;
                const stackH = galtonState.bins[ball.bin];
                by2 = binBaseY - (stackH * 4);
                bx2 = binX;
                // Remove if offscreen below histogram
                if (by2 < pegEndY + 20) by2 = pegEndY + 20;
            } else {
                const idx = Math.floor(ball.progress);
                const frac = ball.progress - idx;
                const p1 = ball.path[Math.min(idx, ball.path.length - 1)];
                const p2 = ball.path[Math.min(idx + 1, ball.path.length - 1)];
                bx2 = p1.x + (p2.x - p1.x) * frac;
                by2 = p1.y + (p2.y - p1.y) * frac;
            }
            ctx.beginPath();
            ctx.arc(bx2, by2, 3, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${ball.hue}, 70%, 60%)`;
            ctx.fill();
        }

        // Draw histogram
        const maxH = H - pegEndY - 60;
        const numBins = rows + 1;
        for (let b = 0; b < numBins; b++) {
            const bx3 = boardCX + (b - rows / 2) * pegSpacing;
            const bh = galtonState.maxBin > 0 ? (galtonState.bins[b] / galtonState.maxBin) * maxH : 0;
            ctx.fillStyle = `hsla(210, 60%, 50%, 0.4)`;
            ctx.fillRect(bx3 - binWidth / 2, binBaseY - bh, binWidth, bh);
            ctx.strokeStyle = `hsla(210, 60%, 60%, 0.6)`;
            ctx.strokeRect(bx3 - binWidth / 2, binBaseY - bh, binWidth, bh);
        }

        // Normal distribution overlay
        if (galtonState.maxBin > 5) {
            const total = galtonState.bins.reduce((a, b) => a + b, 0);
            const mean = galtonState.bins.reduce((s, v, i) => s + v * i, 0) / total;
            const variance = galtonState.bins.reduce((s, v, i) => s + v * (i - mean) * (i - mean), 0) / total;
            const std = Math.sqrt(variance);
            if (std > 0) {
                ctx.beginPath();
                for (let b = 0; b <= rows; b += 0.1) {
                    const nv = Math.exp(-0.5 * ((b - mean) / std) ** 2) / (std * Math.sqrt(2 * Math.PI));
                    const bx4 = boardCX + (b - rows / 2) * pegSpacing;
                    const bh2 = nv * total * (maxH / galtonState.maxBin);
                    if (b === 0) ctx.moveTo(bx4, binBaseY - bh2);
                    else ctx.lineTo(bx4, binBaseY - bh2);
                }
                ctx.strokeStyle = "#ff6b6b";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.lineWidth = 1;
            }
        }

        const total = galtonState.bins.reduce((a, b) => a + b, 0);
        overlay.innerHTML =
            `<b style="color:#6bc5ff">Galton Board</b><br>` +
            `Balls: ${total} | Rows: ${rows}<br>` +
            `Bias: ${bias.toFixed(2)}`;

        animId = requestAnimationFrame(drawGalton);
    }
    bindSlider("galton-rows", "val-galton-rows");
    bindSlider("galton-rate", "val-galton-rate");
    bindSlider("galton-bias", "val-galton-bias");
    document.getElementById("btn-galton-reset").addEventListener("click", initGalton);

    // ── 52. Stress-Strain ────────────────────────────────────
    let ssState = {};
    const materials = {
        steel: { E: 200, yieldStr: 250, ultStr: 400, fracStr: 350, fracStrain: 0.25, name: "Steel", color: "#8899aa" },
        aluminum: { E: 70, yieldStr: 150, ultStr: 200, fracStr: 170, fracStrain: 0.15, name: "Aluminum", color: "#c0c0c0" },
        rubber: { E: 5, yieldStr: 10, ultStr: 30, fracStr: 28, fracStrain: 0.8, name: "Rubber", color: "#cc6644" },
        glass: { E: 70, yieldStr: 50, ultStr: 50, fracStr: 50, fracStrain: 0.002, name: "Glass", color: "#aaddff" }
    };
    function initStressStrain() {
        cancelAnimationFrame(animId);
        currentSim = "stressstrain";
        ssState = {
            strain: 0,
            loading: false,
            fractured: false,
            curve: []
        };
        document.getElementById("btn-ss-toggle").textContent = "Start Loading";
        drawStressStrain();
    }
    function drawStressStrain() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const matKey = document.getElementById("sel-material").value;
        const mat = materials[matKey];
        const loadRate = parseFloat(document.getElementById("load-rate").value);

        if (ssState.loading && !ssState.fractured) {
            ssState.strain += 0.0005 * loadRate;
            let stress;
            const yieldStrain = mat.yieldStr / mat.E;

            if (ssState.strain <= yieldStrain) {
                stress = mat.E * ssState.strain;
            } else if (ssState.strain <= mat.fracStrain * 0.7) {
                const plastic = ssState.strain - yieldStrain;
                stress = mat.yieldStr + (mat.ultStr - mat.yieldStr) * (plastic / (mat.fracStrain * 0.7 - yieldStrain));
            } else if (ssState.strain <= mat.fracStrain) {
                const neckFrac = (ssState.strain - mat.fracStrain * 0.7) / (mat.fracStrain * 0.3);
                stress = mat.ultStr - (mat.ultStr - mat.fracStr) * neckFrac;
            } else {
                ssState.fractured = true;
                ssState.loading = false;
                document.getElementById("btn-ss-toggle").textContent = "Fractured!";
                stress = 0;
            }
            if (!ssState.fractured) {
                ssState.curve.push({ strain: ssState.strain, stress: stress });
            }
        }

        // Graph area
        const gx = 80, gy = 40, gw = 450, gh = H - 100;
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy, gw, gh);

        // Axis labels
        ctx.fillStyle = "#aaa";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Strain", gx + gw / 2, H - 20);
        ctx.save();
        ctx.translate(20, gy + gh / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Stress (MPa)", 0, 0);
        ctx.restore();

        // Scale
        const maxStrain = Math.max(mat.fracStrain * 1.2, 0.01);
        const maxStress = mat.ultStr * 1.3;

        // Grid lines
        ctx.strokeStyle = "rgba(100,100,100,0.3)";
        for (let i = 0; i <= 5; i++) {
            const yy = gy + gh - (i / 5) * gh;
            ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx + gw, yy); ctx.stroke();
            ctx.fillStyle = "#888";
            ctx.textAlign = "right";
            ctx.fillText(((i / 5) * maxStress).toFixed(0), gx - 5, yy + 4);
        }
        for (let i = 0; i <= 5; i++) {
            const xx = gx + (i / 5) * gw;
            ctx.beginPath(); ctx.moveTo(xx, gy); ctx.lineTo(xx, gy + gh); ctx.stroke();
            ctx.fillStyle = "#888";
            ctx.textAlign = "center";
            ctx.fillText(((i / 5) * maxStrain).toFixed(3), xx, gy + gh + 15);
        }

        // Draw curve
        if (ssState.curve.length > 1) {
            ctx.beginPath();
            for (let i = 0; i < ssState.curve.length; i++) {
                const px = gx + (ssState.curve[i].strain / maxStrain) * gw;
                const py = gy + gh - (ssState.curve[i].stress / maxStress) * gh;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = "#00e5ff";
            ctx.lineWidth = 2.5;
            ctx.stroke();
            ctx.lineWidth = 1;

            // Current point
            const last = ssState.curve[ssState.curve.length - 1];
            const lx = gx + (last.strain / maxStrain) * gw;
            const ly = gy + gh - (last.stress / maxStress) * gh;
            ctx.beginPath();
            ctx.arc(lx, ly, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#ff0";
            ctx.fill();
        }

        // Specimen visualization
        const specX = 620, specY = 100, specW = 200, specH = 60;
        const strainVis = Math.min(ssState.strain / maxStrain, 1);
        const elongation = strainVis * 80;
        const necking = ssState.strain > mat.fracStrain * 0.6 ? (ssState.strain - mat.fracStrain * 0.6) / (mat.fracStrain * 0.4) * 15 : 0;

        ctx.fillStyle = mat.color;
        if (ssState.fractured) {
            // Two broken pieces
            ctx.fillRect(specX, specY, specW / 2 - 10 + elongation / 2, specH);
            ctx.fillRect(specX + specW / 2 + 10 + elongation / 2, specY, specW / 2, specH);
            ctx.fillStyle = "#ff4444";
            ctx.font = "16px monospace";
            ctx.textAlign = "center";
            ctx.fillText("FRACTURED", specX + specW / 2 + elongation / 2, specY + specH + 30);
        } else {
            ctx.beginPath();
            ctx.moveTo(specX, specY);
            ctx.lineTo(specX + specW + elongation, specY);
            ctx.lineTo(specX + specW + elongation, specY + specH);
            ctx.lineTo(specX, specY + specH);
            ctx.closePath();
            ctx.fill();
            if (necking > 0) {
                ctx.fillStyle = "#0a0a2e";
                const neckX = specX + (specW + elongation) / 2;
                ctx.beginPath();
                ctx.ellipse(neckX, specY, Math.min(necking, 12), 6, 0, 0, Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(neckX, specY + specH, Math.min(necking, 12), 6, 0, Math.PI, Math.PI * 2);
                ctx.fill();
            }
        }

        // Region labels
        ctx.font = "11px monospace";
        ctx.textAlign = "left";
        const yieldStrain = mat.yieldStr / mat.E;
        if (ssState.strain > 0) {
            const phase = ssState.strain <= yieldStrain ? "Elastic" :
                ssState.strain <= mat.fracStrain * 0.7 ? "Plastic (Hardening)" :
                ssState.strain <= mat.fracStrain ? "Necking" : "Fractured";
            ctx.fillStyle = phase === "Elastic" ? "#4fc3f7" : phase.includes("Plastic") ? "#ffb74d" : phase === "Necking" ? "#ef5350" : "#ff1744";
            ctx.fillText(`Phase: ${phase}`, 620, 250);
        }

        const lastPt = ssState.curve.length > 0 ? ssState.curve[ssState.curve.length - 1] : { strain: 0, stress: 0 };
        overlay.innerHTML =
            `<b style="color:${mat.color}">${mat.name} - Stress-Strain</b><br>` +
            `Strain: ${lastPt.strain.toFixed(4)} | Stress: ${lastPt.stress.toFixed(1)} MPa<br>` +
            `E: ${mat.E} GPa | Yield: ${mat.yieldStr} MPa`;

        animId = requestAnimationFrame(drawStressStrain);
    }
    bindSlider("load-rate", "val-load-rate");
    document.getElementById("btn-ss-toggle").addEventListener("click", () => {
        if (ssState.fractured) return;
        ssState.loading = !ssState.loading;
        document.getElementById("btn-ss-toggle").textContent = ssState.loading ? "Pause" : "Resume Loading";
    });
    document.getElementById("btn-ss-reset").addEventListener("click", initStressStrain);

    // ── 53. Reaction-Diffusion ───────────────────────────────
    let rdState = {};
    function initReactionDiff() {
        cancelAnimationFrame(animId);
        currentSim = "reactiondiff";
        const W = 180, H2 = 104; // Scaled grid
        const gridA = [], gridB = [];
        for (let i = 0; i < W * H2; i++) {
            gridA.push(1);
            gridB.push(0);
        }
        // Initial seed
        const cx = Math.floor(W / 2), cy2 = Math.floor(H2 / 2);
        for (let dy = -5; dy <= 5; dy++) {
            for (let dx = -5; dx <= 5; dx++) {
                if (dx * dx + dy * dy <= 25) {
                    gridB[(cy2 + dy) * W + (cx + dx)] = 1;
                }
            }
        }
        rdState = { W: W, H: H2, gridA, gridB, imgData: ctx.createImageData(W, H2) };
        drawReactionDiff();
    }
    function drawReactionDiff() {
        const cW = canvas.width, cH = canvas.height;
        const { W: gW, H: gH, gridA, gridB, imgData } = rdState;
        const f = parseFloat(document.getElementById("rd-feed").value);
        const k = parseFloat(document.getElementById("rd-kill").value);
        const dA = 1.0, dB = 0.5, dt = 1;

        // Run multiple steps per frame for speed
        for (let step = 0; step < 5; step++) {
            const newA = new Float64Array(gW * gH);
            const newB = new Float64Array(gW * gH);
            for (let y = 0; y < gH; y++) {
                for (let x = 0; x < gW; x++) {
                    const idx = y * gW + x;
                    const a = gridA[idx], b = gridB[idx];
                    // Laplacian with wrapping
                    const l = x > 0 ? x - 1 : gW - 1, r = x < gW - 1 ? x + 1 : 0;
                    const u = y > 0 ? y - 1 : gH - 1, d2 = y < gH - 1 ? y + 1 : 0;
                    const lapA = gridA[y * gW + l] + gridA[y * gW + r] + gridA[u * gW + x] + gridA[d2 * gW + x] - 4 * a;
                    const lapB = gridB[y * gW + l] + gridB[y * gW + r] + gridB[u * gW + x] + gridB[d2 * gW + x] - 4 * b;
                    const abb = a * b * b;
                    newA[idx] = a + (dA * lapA - abb + f * (1 - a)) * dt;
                    newB[idx] = b + (dB * lapB + abb - (k + f) * b) * dt;
                    newA[idx] = Math.max(0, Math.min(1, newA[idx]));
                    newB[idx] = Math.max(0, Math.min(1, newB[idx]));
                }
            }
            for (let i = 0; i < gW * gH; i++) {
                gridA[i] = newA[i];
                gridB[i] = newB[i];
            }
        }

        // Render to image data
        for (let i = 0; i < gW * gH; i++) {
            const val = gridA[i] - gridB[i];
            const c = Math.max(0, Math.min(255, Math.floor(val * 255)));
            // Color map: dark blue -> cyan -> white
            const r2 = c < 128 ? 0 : (c - 128) * 2;
            const g = c < 128 ? c * 1.5 : 180 + (c - 128) * 0.6;
            const b2 = c;
            imgData.data[i * 4] = r2;
            imgData.data[i * 4 + 1] = Math.min(255, g);
            imgData.data[i * 4 + 2] = b2;
            imgData.data[i * 4 + 3] = 255;
        }

        // Scale up to canvas
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, cW, cH);
        const offCanvas = document.createElement("canvas");
        offCanvas.width = gW;
        offCanvas.height = gH;
        offCanvas.getContext("2d").putImageData(imgData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offCanvas, 0, 0, cW, cH);
        ctx.imageSmoothingEnabled = true;

        overlay.innerHTML =
            `<b style="color:#00bcd4">Reaction-Diffusion</b><br>` +
            `Feed: ${f.toFixed(3)} | Kill: ${k.toFixed(3)}<br>` +
            `Grid: ${gW}\u00d7${gH} | Gray-Scott Model`;

        animId = requestAnimationFrame(drawReactionDiff);
    }
    bindSlider("rd-feed", "val-rd-feed");
    bindSlider("rd-kill", "val-rd-kill");
    document.getElementById("btn-rd-reset").addEventListener("click", initReactionDiff);
    document.getElementById("btn-rd-seed").addEventListener("click", () => {
        if (currentSim !== "reactiondiff") return;
        const { W: gW, H: gH, gridB } = rdState;
        const sx = Math.floor(Math.random() * (gW - 10)) + 5;
        const sy = Math.floor(Math.random() * (gH - 10)) + 5;
        for (let dy = -5; dy <= 5; dy++) {
            for (let dx = -5; dx <= 5; dx++) {
                if (dx * dx + dy * dy <= 25) {
                    const idx = (sy + dy) * gW + (sx + dx);
                    if (idx >= 0 && idx < gW * gH) gridB[idx] = 1;
                }
            }
        }
    });

    // ── 54. Fluid Flow ───────────────────────────────────────
    let flowState = {};
    function initFluidFlow() {
        cancelAnimationFrame(animId);
        currentSim = "fluidflow";
        const particles = [];
        for (let i = 0; i < 600; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                age: Math.random() * 100,
                hue: Math.random() * 60 + 190
            });
        }
        flowState = { particles, t: 0 };
        drawFluidFlow();
    }
    function getObstacle(type) {
        const cx = canvas.width * 0.35, cy = canvas.height / 2;
        if (type === "circle") return { type: "circle", cx, cy, r: 40 };
        if (type === "square") return { type: "square", cx: cx - 30, cy: cy - 30, w: 60, h: 60 };
        // airfoil
        return { type: "airfoil", cx, cy, r: 50 };
    }
    function isInsideObstacle(x, y, obs) {
        if (obs.type === "circle") {
            return (x - obs.cx) ** 2 + (y - obs.cy) ** 2 < obs.r ** 2;
        }
        if (obs.type === "square") {
            return x > obs.cx && x < obs.cx + obs.w && y > obs.cy && y < obs.cy + obs.h;
        }
        // airfoil - approximation with ellipse
        const dx = x - obs.cx, dy = y - obs.cy;
        return (dx / obs.r) ** 2 + (dy / (obs.r * 0.3)) ** 2 < 1;
    }
    function flowVelocity(x, y, obs, speed, visc) {
        let vx = speed, vy = 0;
        let dx, dy, dist;
        if (obs.type === "circle") {
            dx = x - obs.cx; dy = y - obs.cy;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < obs.r * 3 && dist > 0) {
                const r2 = obs.r * obs.r;
                const factor = r2 / (dist * dist);
                vx = speed * (1 - factor * (dx * dx - dy * dy) / (dist * dist));
                vy = speed * (-2 * factor * dx * dy / (dist * dist));
                // Wake turbulence behind obstacle
                if (dx > 0 && dist < obs.r * 2) {
                    vy += Math.sin(flowState.t * 3 + y * 0.05) * speed * 0.5 * (1 - visc);
                }
            }
        } else if (obs.type === "square") {
            const scx = obs.cx + obs.w / 2, scy = obs.cy + obs.h / 2;
            dx = x - scx; dy = y - scy;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80 && dist > 0) {
                const factor = 1600 / (dist * dist);
                vx = speed * (1 - factor * 0.5);
                vy = speed * dy / dist * factor * 0.5;
                if (dx > obs.w / 2) {
                    vy += Math.sin(flowState.t * 4 + y * 0.1) * speed * 0.8 * (1 - visc);
                }
            }
        } else {
            dx = x - obs.cx; dy = y - obs.cy;
            dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < obs.r * 3 && dist > 0) {
                const r2 = obs.r * obs.r * 0.3;
                const factor = r2 / (dist * dist);
                vx = speed * (1 - factor * 0.8);
                vy = -dy * factor * speed * 0.3 + (dy > 0 ? -1 : 1) * speed * factor * 0.5;
            }
        }
        return { vx, vy };
    }
    function drawFluidFlow() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "rgba(10, 10, 46, 0.15)";
        ctx.fillRect(0, 0, W, H);

        const speed = parseFloat(document.getElementById("flow-speed").value);
        const obsType = document.getElementById("sel-obstacle").value;
        const visc = parseFloat(document.getElementById("viscosity").value);
        const obs = getObstacle(obsType);
        flowState.t += 0.02;

        // Draw obstacle
        ctx.fillStyle = "#445";
        ctx.strokeStyle = "#778";
        ctx.lineWidth = 2;
        if (obs.type === "circle") {
            ctx.beginPath();
            ctx.arc(obs.cx, obs.cy, obs.r, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
        } else if (obs.type === "square") {
            ctx.fillRect(obs.cx, obs.cy, obs.w, obs.h);
            ctx.strokeRect(obs.cx, obs.cy, obs.w, obs.h);
        } else {
            ctx.beginPath();
            for (let a = 0; a < Math.PI * 2; a += 0.05) {
                const ax = obs.cx + obs.r * Math.cos(a);
                const ay = obs.cy + obs.r * 0.3 * Math.sin(a);
                if (a === 0) ctx.moveTo(ax, ay);
                else ctx.lineTo(ax, ay);
            }
            ctx.closePath();
            ctx.fill(); ctx.stroke();
        }

        // Update particles
        for (const p of flowState.particles) {
            const vel = flowVelocity(p.x, p.y, obs, speed, visc);
            p.x += vel.vx;
            p.y += vel.vy;
            p.age++;

            if (p.x > W || p.x < -10 || p.y < -10 || p.y > H + 10 || p.age > 200 || isInsideObstacle(p.x, p.y, obs)) {
                p.x = -5;
                p.y = Math.random() * H;
                p.age = 0;
                p.hue = Math.random() * 60 + 190;
            }

            const spd = Math.sqrt(vel.vx * vel.vx + vel.vy * vel.vy);
            const alpha = Math.min(1, 0.3 + spd / (speed * 2));
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue + spd * 10}, 70%, 60%, ${alpha})`;
            ctx.fill();
        }

        // Reynolds number approximation
        const Re = (speed * 80 / (visc * 10)).toFixed(0);
        overlay.innerHTML =
            `<b style="color:#4fc3f7">Fluid Flow</b><br>` +
            `Obstacle: ${obsType} | Speed: ${speed}<br>` +
            `Viscosity: ${visc} | Re \u2248 ${Re}`;

        animId = requestAnimationFrame(drawFluidFlow);
    }
    bindSlider("flow-speed", "val-flow-speed");
    bindSlider("viscosity", "val-viscosity");
    document.getElementById("btn-flow-reset").addEventListener("click", initFluidFlow);

    // ── 55. Phase Space ────────────────────────────────────
    let psState = {};
    function initPhaseSpace() {
        cancelAnimationFrame(animId);
        currentSim = "phasespace";
        psState = {
            theta: 2.5, omega: 0, t: 0,
            trail: [],
            pendTrail: []
        };
        drawPhaseSpace();
    }
    function drawPhaseSpace() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const damp = parseFloat(document.getElementById("ps-damp").value);
        const drive = parseFloat(document.getElementById("ps-drive").value);
        const driveFreq = parseFloat(document.getElementById("ps-freq").value);
        const dt = 0.02;

        // RK4 integration for damped driven pendulum
        for (let i = 0; i < 3; i++) {
            psState.t += dt;
            const f = (th, om, t2) => {
                return -Math.sin(th) - damp * om + drive * Math.cos(driveFreq * t2);
            };
            const th = psState.theta, om = psState.omega, t = psState.t;
            const k1v = f(th, om, t) * dt;
            const k1x = om * dt;
            const k2v = f(th + k1x / 2, om + k1v / 2, t + dt / 2) * dt;
            const k2x = (om + k1v / 2) * dt;
            const k3v = f(th + k2x / 2, om + k2v / 2, t + dt / 2) * dt;
            const k3x = (om + k2v / 2) * dt;
            const k4v = f(th + k3x, om + k3v, t + dt) * dt;
            const k4x = (om + k3v) * dt;
            psState.theta += (k1x + 2 * k2x + 2 * k3x + k4x) / 6;
            psState.omega += (k1v + 2 * k2v + 2 * k3v + k4v) / 6;
        }

        // Wrap theta to [-PI, PI]
        while (psState.theta > Math.PI) psState.theta -= 2 * Math.PI;
        while (psState.theta < -Math.PI) psState.theta += 2 * Math.PI;

        psState.trail.push({ x: psState.theta, y: psState.omega });
        if (psState.trail.length > 3000) psState.trail.shift();

        // Phase space plot (right side)
        const px = 400, py = 30, pw = 470, ph = 460;
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, pw, ph);

        // Axes
        const pcx = px + pw / 2, pcy = py + ph / 2;
        ctx.strokeStyle = "#444";
        ctx.beginPath(); ctx.moveTo(px, pcy); ctx.lineTo(px + pw, pcy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pcx, py); ctx.lineTo(pcx, py + ph); ctx.stroke();

        ctx.fillStyle = "#888";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("θ", pcx + pw / 2 - 10, pcy + 15);
        ctx.fillText("ω", pcx + 10, py + 12);
        ctx.fillText("-π", px + 5, pcy + 15);
        ctx.fillText("π", px + pw - 5, pcy + 15);

        // Draw trail
        const scaleX = pw / (2 * Math.PI);
        const maxOmega = 5;
        const scaleY = ph / (2 * maxOmega);
        for (let i = 1; i < psState.trail.length; i++) {
            const p1 = psState.trail[i - 1], p2 = psState.trail[i];
            // Don't draw wrap-around lines
            if (Math.abs(p2.x - p1.x) > 3) continue;
            const sx1 = pcx + p1.x * scaleX, sy1 = pcy - p1.y * scaleY;
            const sx2 = pcx + p2.x * scaleX, sy2 = pcy - p2.y * scaleY;
            const alpha = 0.3 + 0.7 * (i / psState.trail.length);
            const hue = (i / psState.trail.length) * 270;
            ctx.beginPath();
            ctx.moveTo(sx1, sy1);
            ctx.lineTo(sx2, sy2);
            ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Current point
        const cx2 = pcx + psState.theta * scaleX;
        const cy2 = pcy - psState.omega * scaleY;
        ctx.beginPath();
        ctx.arc(cx2, cy2, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();

        // Pendulum visualization (left side)
        const pendCX = 180, pendCY = 200, pendL = 120;
        const bobX = pendCX + pendL * Math.sin(psState.theta);
        const bobY = pendCY + pendL * Math.cos(psState.theta);

        ctx.strokeStyle = "#556";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pendCX, pendCY); ctx.lineTo(bobX, bobY); ctx.stroke();
        ctx.beginPath();
        ctx.arc(bobX, bobY, 15, 0, Math.PI * 2);
        ctx.fillStyle = "#4fc3f7";
        ctx.fill();
        ctx.strokeStyle = "#29b6f6";
        ctx.stroke();

        // Pivot
        ctx.beginPath();
        ctx.arc(pendCX, pendCY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#888";
        ctx.fill();

        // Drive indicator
        if (drive > 0) {
            const driveY = pendCY + 30 * Math.cos(driveFreq * psState.t);
            ctx.fillStyle = "rgba(255,200,0,0.5)";
            ctx.fillRect(pendCX - 40, driveY - 2, 80, 4);
        }

        overlay.innerHTML =
            `<b style="color:#4fc3f7">Phase Space</b><br>` +
            `θ: ${psState.theta.toFixed(3)} | ω: ${psState.omega.toFixed(3)}<br>` +
            `Damping: ${damp} | Drive: ${drive}`;

        animId = requestAnimationFrame(drawPhaseSpace);
    }
    bindSlider("ps-damp", "val-ps-damp");
    bindSlider("ps-drive", "val-ps-drive");
    bindSlider("ps-freq", "val-ps-freq");
    document.getElementById("btn-ps-clear").addEventListener("click", () => { psState.trail = []; });
    document.getElementById("btn-ps-reset").addEventListener("click", initPhaseSpace);

    // ── 56. Radiocarbon Dating ───────────────────────────────
    let rcState = {};
    function initRadiocarbon() {
        cancelAnimationFrame(animId);
        currentSim = "radiocarbon";
        rcState = { elapsed: 0, atoms: [] };
        const initCount = parseInt(document.getElementById("rc-init").value);
        for (let i = 0; i < initCount; i++) {
            rcState.atoms.push({
                x: 520 + Math.random() * 340,
                y: 60 + Math.random() * 400,
                alive: true,
                decayTime: -5730 * Math.log(Math.random()),
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
        drawRadiocarbon();
    }
    function drawRadiocarbon() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const sampleAge = parseInt(document.getElementById("rc-age").value);
        const speed = parseFloat(document.getElementById("rc-speed").value);
        const halfLife = 5730; // years

        rcState.elapsed += 20 * speed;

        // Decay curve (left side)
        const gx = 40, gy = 40, gw = 420, gh = 420;
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy, gw, gh);

        // Grid
        const maxT = Math.max(sampleAge * 1.5, 30000);
        const initCount = rcState.atoms.length;
        for (let i = 0; i <= 5; i++) {
            const yy = gy + (i / 5) * gh;
            ctx.strokeStyle = "rgba(100,100,100,0.2)";
            ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx + gw, yy); ctx.stroke();
            ctx.fillStyle = "#888";
            ctx.font = "10px monospace";
            ctx.textAlign = "right";
            ctx.fillText(((5 - i) / 5 * 100).toFixed(0) + "%", gx - 5, yy + 4);
        }
        for (let i = 0; i <= 5; i++) {
            const xx = gx + (i / 5) * gw;
            ctx.strokeStyle = "rgba(100,100,100,0.2)";
            ctx.beginPath(); ctx.moveTo(xx, gy); ctx.lineTo(xx, gy + gh); ctx.stroke();
            ctx.fillStyle = "#888";
            ctx.textAlign = "center";
            ctx.fillText((i / 5 * maxT / 1000).toFixed(0) + "k", xx, gy + gh + 15);
        }

        // Theoretical curve
        ctx.beginPath();
        for (let px = 0; px <= gw; px++) {
            const t = (px / gw) * maxT;
            const frac = Math.pow(0.5, t / halfLife);
            const py = gy + gh - frac * gh;
            if (px === 0) ctx.moveTo(gx + px, py);
            else ctx.lineTo(gx + px, py);
        }
        ctx.strokeStyle = "#4fc3f7";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Half-life markers
        ctx.setLineDash([4, 4]);
        for (let n = 1; n <= 5; n++) {
            const hl = n * halfLife;
            if (hl > maxT) break;
            const hlx = gx + (hl / maxT) * gw;
            const hly = gy + gh - Math.pow(0.5, n) * gh;
            ctx.strokeStyle = "rgba(255,200,0,0.3)";
            ctx.beginPath(); ctx.moveTo(hlx, gy); ctx.lineTo(hlx, gy + gh); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(gx, hly); ctx.lineTo(gx + gw, hly); ctx.stroke();
            ctx.fillStyle = "#cc9";
            ctx.textAlign = "center";
            ctx.font = "9px monospace";
            ctx.fillText(`t½×${n}`, hlx, gy - 5);
        }
        ctx.setLineDash([]);

        // Current time marker
        const elapsedClamped = Math.min(rcState.elapsed, maxT);
        const curX = gx + (elapsedClamped / maxT) * gw;
        const curFrac = Math.pow(0.5, elapsedClamped / halfLife);
        const curY = gy + gh - curFrac * gh;
        ctx.beginPath();
        ctx.arc(curX, curY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0";
        ctx.fill();

        // Sample age line
        const sampleX = gx + (sampleAge / maxT) * gw;
        ctx.strokeStyle = "#f44";
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 3]);
        ctx.beginPath(); ctx.moveTo(sampleX, gy); ctx.lineTo(sampleX, gy + gh); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#f44";
        ctx.textAlign = "center";
        ctx.font = "11px monospace";
        ctx.fillText(`Sample: ${sampleAge}y`, sampleX, gy - 8);

        // Atom visualization (right side)
        const alive = rcState.atoms.filter(a => a.alive && rcState.elapsed < a.decayTime).length;
        for (const atom of rcState.atoms) {
            atom.x += atom.vx;
            atom.y += atom.vy;
            if (atom.x < 510 || atom.x > 890) atom.vx *= -1;
            if (atom.y < 50 || atom.y > 470) atom.vy *= -1;

            const isAlive = atom.alive && rcState.elapsed < atom.decayTime;
            ctx.beginPath();
            ctx.arc(atom.x, atom.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = isAlive ? "#4fc3f7" : "rgba(100,60,60,0.3)";
            ctx.fill();
        }

        // Box outline
        ctx.strokeStyle = "#445";
        ctx.lineWidth = 1;
        ctx.strokeRect(505, 45, 390, 430);
        ctx.fillStyle = "#aaa";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Sample Atoms", 700, 490);

        const pctRemaining = (alive / initCount * 100).toFixed(1);
        const estimatedAge = alive > 0 && alive < initCount ?
            (-halfLife * Math.log(alive / initCount) / Math.log(2)).toFixed(0) : "N/A";

        overlay.innerHTML =
            `<b style="color:#4fc3f7">Radiocarbon Dating</b><br>` +
            `Elapsed: ${(rcState.elapsed).toFixed(0)}y | C-14: ${pctRemaining}%<br>` +
            `Remaining: ${alive}/${initCount} | Est. Age: ${estimatedAge}y<br>` +
            `Half-life: ${halfLife}y`;

        animId = requestAnimationFrame(drawRadiocarbon);
    }
    bindSlider("rc-age", "val-rc-age");
    bindSlider("rc-init", "val-rc-init");
    bindSlider("rc-speed", "val-rc-speed");
    document.getElementById("btn-rc-reset").addEventListener("click", initRadiocarbon);

    // ── 57. Mandelbrot Set ───────────────────────────────────
    let mbState = {};
    function initMandelbrot() {
        cancelAnimationFrame(animId);
        currentSim = "mandelbrot";
        mbState = {
            centerX: -0.5, centerY: 0, zoom: 1.5,
            needsRender: true
        };
        canvas.addEventListener("click", mbClick);
        drawMandelbrot();
    }
    function mbClick(e) {
        if (currentSim !== "mandelbrot") return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) / rect.width;
        const my = (e.clientY - rect.top) / rect.height;
        const W = canvas.width, H2 = canvas.height;
        const aspect = W / H2;
        mbState.centerX += (mx - 0.5) * 2 * mbState.zoom * aspect;
        mbState.centerY += (my - 0.5) * 2 * mbState.zoom;
        mbState.zoom *= 0.5;
        mbState.needsRender = true;
    }
    function mandelbrotColor(iter, maxIter, scheme) {
        if (iter === maxIter) return [0, 0, 0];
        const t = iter / maxIter;
        if (scheme === "fire") return [Math.min(255, t * 600), Math.min(255, t * 300), Math.min(255, t * 100)];
        if (scheme === "ocean") return [Math.min(255, t * 100), Math.min(255, t * 300), Math.min(255, 50 + t * 400)];
        if (scheme === "grayscale") { const v = Math.floor(t * 255); return [v, v, v]; }
        // classic
        const hue = t * 360;
        const s = 0.8, l = t < 1 ? 0.5 : 0;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
        const m = l - c / 2;
        let r, g, b;
        if (hue < 60) { r = c; g = x; b = 0; }
        else if (hue < 120) { r = x; g = c; b = 0; }
        else if (hue < 180) { r = 0; g = c; b = x; }
        else if (hue < 240) { r = 0; g = x; b = c; }
        else if (hue < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        return [Math.floor((r + m) * 255), Math.floor((g + m) * 255), Math.floor((b + m) * 255)];
    }
    function drawMandelbrot() {
        const W = canvas.width, H2 = canvas.height;

        if (mbState.needsRender) {
            mbState.needsRender = false;
            const maxIter = parseInt(document.getElementById("mb-iter").value);
            const scheme = document.getElementById("sel-mb-color").value;
            const aspect = W / H2;
            const imgData = ctx.createImageData(W, H2);

            for (let py = 0; py < H2; py++) {
                for (let px = 0; px < W; px++) {
                    const x0 = mbState.centerX + (px / W - 0.5) * 2 * mbState.zoom * aspect;
                    const y0 = mbState.centerY + (py / H2 - 0.5) * 2 * mbState.zoom;
                    let x = 0, y = 0, iter = 0;
                    while (x * x + y * y <= 4 && iter < maxIter) {
                        const xt = x * x - y * y + x0;
                        y = 2 * x * y + y0;
                        x = xt;
                        iter++;
                    }
                    // Smooth coloring
                    let smoothIter = iter;
                    if (iter < maxIter) {
                        const log_zn = Math.log(x * x + y * y) / 2;
                        const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
                        smoothIter = iter + 1 - nu;
                    }
                    const [r, g, b] = mandelbrotColor(smoothIter, maxIter, scheme);
                    const idx = (py * W + px) * 4;
                    imgData.data[idx] = r;
                    imgData.data[idx + 1] = g;
                    imgData.data[idx + 2] = b;
                    imgData.data[idx + 3] = 255;
                }
            }
            ctx.putImageData(imgData, 0, 0);
        }

        // Info box
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(5, 5, 250, 50);
        ctx.fillStyle = "#fff";
        ctx.font = "11px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`Center: (${mbState.centerX.toFixed(8)}, ${mbState.centerY.toFixed(8)})`, 10, 22);
        ctx.fillText(`Zoom: ${(1 / mbState.zoom).toFixed(2)}x  |  Click to zoom in`, 10, 40);

        overlay.innerHTML =
            `<b style="color:#e040fb">Mandelbrot Set</b><br>` +
            `Zoom: ${(1 / mbState.zoom).toFixed(1)}x<br>` +
            `Click canvas to zoom in`;

        animId = requestAnimationFrame(drawMandelbrot);
    }
    bindSlider("mb-iter", "val-mb-iter", () => { mbState.needsRender = true; });
    document.getElementById("sel-mb-color").addEventListener("change", () => { mbState.needsRender = true; });
    document.getElementById("btn-mb-reset").addEventListener("click", () => {
        mbState.centerX = -0.5; mbState.centerY = 0; mbState.zoom = 1.5;
        mbState.needsRender = true;
    });
    document.getElementById("btn-mb-zoomout").addEventListener("click", () => {
        mbState.zoom *= 2;
        mbState.needsRender = true;
    });

    // ── 58. SHM Comparison ───────────────────────────────────
    let shmState = {};
    function initSHM() {
        cancelAnimationFrame(animId);
        currentSim = "shm";
        shmState = { t: 0, trails: [[], [], []] };
        drawSHM();
    }
    function drawSHM() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const freq = parseFloat(document.getElementById("shm-freq").value);
        const amp = parseFloat(document.getElementById("shm-amp").value);
        const phaseOff = parseFloat(document.getElementById("shm-phase").value) * Math.PI / 180;
        shmState.t += 0.03;

        const omega = 2 * Math.PI * freq;
        const y1 = amp * Math.sin(omega * shmState.t); // spring
        const y2 = amp * Math.sin(omega * shmState.t + phaseOff); // pendulum
        const y3 = amp * Math.sin(omega * shmState.t + phaseOff * 2); // circular projection

        const sections = [
            { label: "Spring-Mass", x: 120, color: "#4fc3f7", y: y1 },
            { label: "Pendulum", x: 330, color: "#66bb6a", y: y2 },
            { label: "Circular Motion", x: 540, color: "#ffa726", y: y3 }
        ];

        const centerY = H / 2;

        sections.forEach((sec, idx) => {
            // Section header
            ctx.fillStyle = sec.color;
            ctx.font = "14px monospace";
            ctx.textAlign = "center";
            ctx.fillText(sec.label, sec.x, 25);

            const bobY = centerY + sec.y;

            if (idx === 0) {
                // Spring visualization
                const springTop = 50, nCoils = 12;
                const springLen = bobY - springTop - 15;
                ctx.beginPath();
                ctx.moveTo(sec.x, springTop);
                for (let i = 0; i <= nCoils; i++) {
                    const sy = springTop + (i / nCoils) * springLen;
                    const sx = sec.x + (i % 2 === 0 ? -15 : 15);
                    ctx.lineTo(sx, sy);
                }
                ctx.lineTo(sec.x, bobY - 15);
                ctx.strokeStyle = "#888";
                ctx.lineWidth = 2;
                ctx.stroke();
                // Mount
                ctx.fillStyle = "#666";
                ctx.fillRect(sec.x - 30, springTop - 5, 60, 5);
            } else if (idx === 1) {
                // Pendulum
                const pivotY = 55;
                const angle = Math.asin(Math.max(-1, Math.min(1, sec.y / amp)));
                const pLen = 150;
                const pbX = sec.x + pLen * Math.sin(angle);
                const pbY = pivotY + pLen * Math.cos(angle);
                ctx.strokeStyle = "#888";
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(sec.x, pivotY); ctx.lineTo(pbX, pbY); ctx.stroke();
                ctx.beginPath(); ctx.arc(sec.x, pivotY, 5, 0, Math.PI * 2); ctx.fillStyle = "#888"; ctx.fill();
                ctx.beginPath(); ctx.arc(pbX, pbY, 12, 0, Math.PI * 2); ctx.fillStyle = sec.color; ctx.fill();
            } else {
                // Circular motion with projection
                const circR = amp;
                const circCY = centerY;
                const angle = omega * shmState.t + phaseOff * 2;
                const dotX = sec.x + circR * Math.cos(angle);
                const dotY = circCY - circR * Math.sin(angle);
                ctx.strokeStyle = "rgba(255,167,38,0.3)";
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.arc(sec.x, circCY, circR, 0, Math.PI * 2); ctx.stroke();
                // Projection line
                ctx.setLineDash([3, 3]);
                ctx.strokeStyle = "rgba(255,167,38,0.5)";
                ctx.beginPath(); ctx.moveTo(dotX, dotY); ctx.lineTo(sec.x + circR + 40, dotY); ctx.stroke();
                ctx.setLineDash([]);
                ctx.beginPath(); ctx.arc(dotX, dotY, 8, 0, Math.PI * 2); ctx.fillStyle = sec.color; ctx.fill();
                // Radius line
                ctx.strokeStyle = sec.color;
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(sec.x, circCY); ctx.lineTo(dotX, dotY); ctx.stroke();
            }

            if (idx === 0) {
                // Bob for spring
                ctx.beginPath();
                ctx.arc(sec.x, bobY, 15, 0, Math.PI * 2);
                ctx.fillStyle = sec.color;
                ctx.fill();
            }

            // Trail / waveform on the right
            shmState.trails[idx].push(sec.y);
            if (shmState.trails[idx].length > 200) shmState.trails[idx].shift();
        });

        // Combined waveform on the right
        const waveX = 680, waveW = 200;
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        ctx.strokeRect(waveX, 50, waveW, H - 100);
        ctx.beginPath(); ctx.moveTo(waveX, centerY); ctx.lineTo(waveX + waveW, centerY);
        ctx.strokeStyle = "#333"; ctx.stroke();

        ctx.fillStyle = "#888";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Displacement vs Time", waveX + waveW / 2, 40);

        sections.forEach((sec, idx) => {
            const trail = shmState.trails[idx];
            ctx.beginPath();
            for (let i = 0; i < trail.length; i++) {
                const tx = waveX + waveW - (trail.length - i) * (waveW / 200);
                const ty = centerY + trail[i];
                if (i === 0) ctx.moveTo(tx, ty);
                else ctx.lineTo(tx, ty);
            }
            ctx.strokeStyle = sec.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Equilibrium line for spring and pendulum
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(600, centerY); ctx.stroke();
        ctx.setLineDash([]);

        overlay.innerHTML =
            `<b style="color:#4fc3f7">SHM Comparison</b><br>` +
            `f: ${freq} Hz | A: ${amp} px<br>` +
            `ω: ${omega.toFixed(2)} rad/s | T: ${(1/freq).toFixed(2)} s`;

        animId = requestAnimationFrame(drawSHM);
    }
    bindSlider("shm-freq", "val-shm-freq");
    bindSlider("shm-amp", "val-shm-amp");
    bindSlider("shm-phase", "val-shm-phase");

    // ── 59. Vector Fields ────────────────────────────────────
    let vfState = {};
    function initVectorField() {
        cancelAnimationFrame(animId);
        currentSim = "vector";
        const particles = [];
        for (let i = 0; i < 300; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                age: Math.random() * 80
            });
        }
        vfState = { particles, t: 0 };
        drawVectorField();
    }
    function getFieldVector(x, y, type, str) {
        const W = canvas.width, H = canvas.height;
        const cx = W / 2, cy = H / 2;
        const dx = x - cx, dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) + 1;
        const s = str * 0.5;
        if (type === "radial") {
            return { vx: s * dx / dist, vy: s * dy / dist };
        }
        if (type === "vortex") {
            return { vx: -s * dy / dist, vy: s * dx / dist };
        }
        if (type === "dipole") {
            const r3 = dist * dist * dist;
            return {
                vx: s * (2 * dx * dy) / r3 * 1000,
                vy: s * (dy * dy - dx * dx) / r3 * 1000
            };
        }
        // saddle
        return { vx: s * dx / dist, vy: -s * dy / dist };
    }
    function drawVectorField() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const type = document.getElementById("sel-vf-type").value;
        const str = parseFloat(document.getElementById("vf-str").value);
        const showParts = document.getElementById("sel-vf-particles").value === "yes";
        vfState.t += 0.02;

        // Draw vector arrows on grid
        const spacing = 40;
        for (let gx = spacing; gx < W; gx += spacing) {
            for (let gy = spacing; gy < H; gy += spacing) {
                const { vx, vy } = getFieldVector(gx, gy, type, str);
                const mag = Math.sqrt(vx * vx + vy * vy);
                const maxLen = spacing * 0.4;
                const scale = Math.min(maxLen / (mag + 0.01), maxLen);
                const ex = gx + vx * scale;
                const ey = gy + vy * scale;

                const hue = Math.min(mag * 30, 240);
                const alpha = Math.min(0.3 + mag * 0.1, 0.9);
                ctx.strokeStyle = `hsla(${240 - hue}, 80%, 60%, ${alpha})`;
                ctx.lineWidth = 1.2;

                ctx.beginPath();
                ctx.moveTo(gx, gy);
                ctx.lineTo(ex, ey);
                ctx.stroke();

                // Arrowhead
                if (mag > 0.1) {
                    const angle = Math.atan2(vy, vx);
                    const headLen = 5;
                    ctx.beginPath();
                    ctx.moveTo(ex, ey);
                    ctx.lineTo(ex - headLen * Math.cos(angle - 0.4), ey - headLen * Math.sin(angle - 0.4));
                    ctx.moveTo(ex, ey);
                    ctx.lineTo(ex - headLen * Math.cos(angle + 0.4), ey - headLen * Math.sin(angle + 0.4));
                    ctx.stroke();
                }
            }
        }

        // Particles
        if (showParts) {
            for (const p of vfState.particles) {
                const { vx, vy } = getFieldVector(p.x, p.y, type, str);
                p.x += vx * 0.5;
                p.y += vy * 0.5;
                p.age++;

                if (p.x < 0 || p.x > W || p.y < 0 || p.y > H || p.age > 100) {
                    p.x = Math.random() * W;
                    p.y = Math.random() * H;
                    p.age = 0;
                }

                const pAlpha = Math.min(1, p.age / 10) * Math.max(0, 1 - p.age / 100);
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 220, 100, ${pAlpha})`;
                ctx.fill();
            }
        }

        // Center marker
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#f44";
        ctx.fill();
        ctx.strokeStyle = "#f88";
        ctx.lineWidth = 1;
        ctx.stroke();

        const labels = { radial: "Source/Sink", vortex: "Curl/Vortex", dipole: "Dipole", saddle: "Saddle Point" };
        overlay.innerHTML =
            `<b style="color:#ffd54f">Vector Field</b><br>` +
            `Type: ${labels[type]}<br>` +
            `Strength: ${str} | ∇·F, ∇×F visualization`;

        animId = requestAnimationFrame(drawVectorField);
    }
    bindSlider("vf-str", "val-vf-str");
    document.getElementById("btn-vf-reset").addEventListener("click", () => {
        for (const p of vfState.particles) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
            p.age = 0;
        }
    });

    // ── 60. Capacitor Charging ─────────────────────────────
    let capState = {};
    function initCapacitor() {
        cancelAnimationFrame(animId);
        currentSim = "capacitor";
        capState = { t: 0, mode: "idle", charge: 0, history: [] };
        drawCapacitor();
    }
    function drawCapacitor() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const C = parseFloat(document.getElementById("cap-c").value) * 1e-6;
        const R = parseFloat(document.getElementById("cap-r").value) * 1e3;
        const V0 = parseFloat(document.getElementById("cap-v").value);
        const tau = R * C;

        if (capState.mode === "charging") {
            capState.t += 0.016;
            capState.charge = V0 * (1 - Math.exp(-capState.t / tau));
        } else if (capState.mode === "discharging") {
            capState.t += 0.016;
            capState.charge = capState.startV * Math.exp(-capState.t / tau);
        }

        if (capState.mode !== "idle") {
            capState.history.push({ t: capState.history.length * 0.016, v: capState.charge });
            if (capState.history.length > 600) capState.history = capState.history.slice(-600);
        }

        // Circuit schematic (left side)
        const cx = 160, cy = H / 2;
        // Battery
        ctx.strokeStyle = "#aaa";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(60, cy - 80); ctx.lineTo(60, cy - 20);
        ctx.stroke();
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(45, cy - 20); ctx.lineTo(75, cy - 20);
        ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(50, cy - 35); ctx.lineTo(70, cy - 35);
        ctx.stroke();
        ctx.fillStyle = "#aaa";
        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${V0}V`, 60, cy - 85);
        ctx.fillText("+", 80, cy - 30);

        // Wires
        ctx.strokeStyle = capState.mode === "charging" ? "#4fc3f7" : capState.mode === "discharging" ? "#ff7043" : "#666";
        ctx.lineWidth = 2;
        // Top wire
        ctx.beginPath();
        ctx.moveTo(60, cy - 80); ctx.lineTo(60, cy - 120);
        ctx.lineTo(260, cy - 120); ctx.stroke();
        // Bottom wire
        ctx.beginPath();
        ctx.moveTo(60, cy + 80); ctx.lineTo(60, cy + 120);
        ctx.lineTo(260, cy + 120); ctx.stroke();

        // Resistor (zigzag)
        ctx.beginPath();
        ctx.moveTo(60, cy + 20); ctx.lineTo(60, cy + 80);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(60, cy - 20); ctx.lineTo(60, cy + 20);
        const rSegs = 6;
        for (let i = 0; i <= rSegs; i++) {
            const ry = (cy - 20) + (i / rSegs) * 40;
            const rx = 60 + (i % 2 === 0 ? -10 : 10);
            ctx.lineTo(rx, ry);
        }
        ctx.strokeStyle = "#ff9800";
        ctx.stroke();
        ctx.fillStyle = "#ff9800";
        ctx.fillText(`${(R/1000).toFixed(0)}kΩ`, 95, cy);

        // Capacitor plates
        const plateX = 260, plateGap = 20;
        const plateH = 80;
        const chargeLevel = capState.charge / V0;
        ctx.strokeStyle = "#4fc3f7";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(plateX, cy - plateH / 2);
        ctx.lineTo(plateX, cy + plateH / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(plateX + plateGap, cy - plateH / 2);
        ctx.lineTo(plateX + plateGap, cy + plateH / 2);
        ctx.stroke();

        // Connect plates to wires
        ctx.strokeStyle = capState.mode !== "idle" ? "#4fc3f7" : "#666";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(260, cy - 120); ctx.lineTo(260, cy - plateH / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(280, cy + 120); ctx.lineTo(280, cy + plateH / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(260, cy + 120); ctx.lineTo(280, cy + 120);
        ctx.stroke();

        // Electric field between plates
        const numFieldLines = Math.floor(chargeLevel * 8);
        for (let i = 0; i < numFieldLines; i++) {
            const fy = cy - plateH / 2 + (i + 1) * plateH / (numFieldLines + 1);
            ctx.strokeStyle = `rgba(255,235,59,${0.3 + chargeLevel * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(plateX + 3, fy); ctx.lineTo(plateX + plateGap - 3, fy);
            ctx.stroke();
            // Arrow
            ctx.beginPath();
            ctx.moveTo(plateX + plateGap - 6, fy - 3);
            ctx.lineTo(plateX + plateGap - 3, fy);
            ctx.lineTo(plateX + plateGap - 6, fy + 3);
            ctx.stroke();
        }

        // Charge indicators on plates
        const nCharges = Math.floor(chargeLevel * 6);
        for (let i = 0; i < nCharges; i++) {
            const chY = cy - plateH / 2 + (i + 1) * plateH / (nCharges + 1);
            ctx.fillStyle = "#f44";
            ctx.font = "12px monospace";
            ctx.textAlign = "center";
            ctx.fillText("+", plateX - 8, chY + 4);
            ctx.fillStyle = "#4fc3f7";
            ctx.fillText("−", plateX + plateGap + 8, chY + 4);
        }

        ctx.fillStyle = "#aaa";
        ctx.font = "11px monospace";
        ctx.fillText(`${(C * 1e6).toFixed(0)}μF`, 270, cy + plateH / 2 + 20);

        // Voltage/current graph (right side)
        const gx = 380, gy = 50, gw = 480, gh = 400;
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy, gw, gh);

        ctx.fillStyle = "#888";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Time", gx + gw / 2, gy + gh + 20);
        ctx.textAlign = "right";
        for (let i = 0; i <= 4; i++) {
            const yy = gy + (i / 4) * gh;
            ctx.fillText(((4 - i) / 4 * V0).toFixed(1) + "V", gx - 5, yy + 4);
            ctx.strokeStyle = "rgba(100,100,100,0.2)";
            ctx.beginPath(); ctx.moveTo(gx, yy); ctx.lineTo(gx + gw, yy); ctx.stroke();
        }

        // Theoretical curves
        const maxT = tau * 5;
        // Voltage
        ctx.beginPath();
        for (let px = 0; px < gw; px++) {
            const tt = (px / gw) * maxT;
            const v = capState.mode === "discharging"
                ? (capState.startV || V0) * Math.exp(-tt / tau)
                : V0 * (1 - Math.exp(-tt / tau));
            const py = gy + gh - (v / V0) * gh;
            if (px === 0) ctx.moveTo(gx + px, py);
            else ctx.lineTo(gx + px, py);
        }
        ctx.strokeStyle = "rgba(79,195,247,0.3)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Actual history
        if (capState.history.length > 1) {
            const totalT = capState.history[capState.history.length - 1].t;
            const drawMaxT = Math.max(totalT, tau * 5);
            ctx.beginPath();
            for (let i = 0; i < capState.history.length; i++) {
                const px = gx + (capState.history[i].t / drawMaxT) * gw;
                const py = gy + gh - (capState.history[i].v / V0) * gh;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = "#4fc3f7";
            ctx.lineWidth = 2.5;
            ctx.stroke();
        }

        // Tau marker
        const tauX = gx + (tau / (tau * 5)) * gw;
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "#ff0";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(tauX, gy); ctx.lineTo(tauX, gy + gh); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#ff0";
        ctx.textAlign = "center";
        ctx.fillText("τ=" + (tau * 1000).toFixed(0) + "ms", tauX, gy - 5);

        const current = capState.mode === "charging"
            ? (V0 / R) * Math.exp(-capState.t / tau) * 1000
            : capState.mode === "discharging"
            ? -(capState.startV || V0) / R * Math.exp(-capState.t / tau) * 1000
            : 0;

        overlay.innerHTML =
            `<b style="color:#4fc3f7">Capacitor</b><br>` +
            `V: ${capState.charge.toFixed(2)}V | I: ${current.toFixed(2)}mA<br>` +
            `τ: ${(tau * 1000).toFixed(1)}ms | ${capState.mode}`;

        animId = requestAnimationFrame(drawCapacitor);
    }
    bindSlider("cap-c", "val-cap-c");
    bindSlider("cap-r", "val-cap-r");
    bindSlider("cap-v", "val-cap-v");
    document.getElementById("btn-cap-charge").addEventListener("click", () => {
        capState.t = 0; capState.mode = "charging"; capState.history = [];
    });
    document.getElementById("btn-cap-discharge").addEventListener("click", () => {
        capState.startV = capState.charge || parseFloat(document.getElementById("cap-v").value);
        capState.t = 0; capState.mode = "discharging"; capState.history = [];
    });
    document.getElementById("btn-cap-reset").addEventListener("click", initCapacitor);

    // ── 61. Brachistochrone ──────────────────────────────────
    let braState = {};
    function initBrachistochrone() {
        cancelAnimationFrame(animId);
        currentSim = "brachistochrone";
        braState = { racing: false, t: 0, balls: null };
        drawBrachistochrone();
    }
    function buildPaths(endH, endX) {
        const N = 200;
        const paths = [];
        // Straight line
        const straight = [];
        for (let i = 0; i <= N; i++) {
            straight.push({ x: (i / N) * endX, y: (i / N) * endH });
        }
        paths.push({ name: "Straight", color: "#f44336", points: straight });

        // Parabola
        const parab = [];
        for (let i = 0; i <= N; i++) {
            const frac = i / N;
            parab.push({ x: frac * endX, y: frac * frac * endH });
        }
        paths.push({ name: "Parabola", color: "#ff9800", points: parab });

        // Cycloid (brachistochrone)
        // Find cycloid parameter: solve for radius given endpoint
        const targetX = endX, targetY = endH;
        let bestR = 50;
        for (let r = 10; r < 500; r += 0.5) {
            const theta = 2 * Math.asin(Math.sqrt(targetY / (2 * r)));
            const cx = r * (theta - Math.sin(theta));
            if (cx >= targetX * 0.95 && cx <= targetX * 1.05) {
                bestR = r;
                break;
            }
        }
        const cycloid = [];
        const maxTheta = 2 * Math.asin(Math.min(1, Math.sqrt(endH / (2 * bestR))));
        for (let i = 0; i <= N; i++) {
            const theta = (i / N) * maxTheta;
            const cx = bestR * (theta - Math.sin(theta));
            const cy = bestR * (1 - Math.cos(theta));
            cycloid.push({ x: cx * (endX / (bestR * (maxTheta - Math.sin(maxTheta)))), y: cy * (endH / (bestR * (1 - Math.cos(maxTheta)))) });
        }
        paths.push({ name: "Cycloid", color: "#4caf50", points: cycloid });

        return paths;
    }
    function drawBrachistochrone() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const g = parseFloat(document.getElementById("bra-g").value);
        const endH = parseFloat(document.getElementById("bra-h").value);
        const startX = 60, startY = 60;
        const endX = 600;

        const paths = buildPaths(endH, endX);

        // Draw paths
        for (const path of paths) {
            ctx.beginPath();
            for (let i = 0; i < path.points.length; i++) {
                const px = startX + path.points[i].x;
                const py = startY + path.points[i].y;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.strokeStyle = path.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Start and end markers
        ctx.beginPath();
        ctx.arc(startX, startY, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(startX + endX, startY + endH, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0";
        ctx.fill();
        ctx.fillStyle = "#888";
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        ctx.fillText("Start", startX + 10, startY - 5);
        ctx.fillText("End", startX + endX + 12, startY + endH);

        // Racing
        if (braState.racing) {
            braState.t += 0.5;
            let allDone = true;

            for (let b = 0; b < braState.balls.length; b++) {
                const ball = braState.balls[b];
                if (ball.done) {
                    // Draw at end
                    ctx.beginPath();
                    ctx.arc(startX + endX, startY + endH, 8, 0, Math.PI * 2);
                    ctx.fillStyle = paths[b].color;
                    ctx.fill();
                    continue;
                }
                allDone = false;

                // Move ball along path using energy conservation
                const pts = paths[b].points;
                ball.dist += 0.003 * braState.t;
                const idx = Math.min(Math.floor(ball.dist * pts.length), pts.length - 1);

                if (idx >= pts.length - 1) {
                    ball.done = true;
                    ball.finishTime = braState.t;
                } else {
                    // Speed from height: v = sqrt(2*g*h)
                    const h = pts[idx].y;
                    const speed = Math.sqrt(2 * g * Math.max(0.1, h)) * 0.0004;
                    ball.dist += speed;
                    const drawIdx = Math.min(Math.floor(ball.dist * pts.length), pts.length - 1);
                    const pt = pts[drawIdx];
                    ctx.beginPath();
                    ctx.arc(startX + pt.x, startY + pt.y, 8, 0, Math.PI * 2);
                    ctx.fillStyle = paths[b].color;
                    ctx.fill();
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        // Legend and times
        ctx.font = "13px monospace";
        for (let i = 0; i < paths.length; i++) {
            const ly = H - 80 + i * 22;
            ctx.fillStyle = paths[i].color;
            ctx.fillRect(700, ly, 15, 15);
            ctx.fillStyle = "#ccc";
            ctx.textAlign = "left";
            let label = paths[i].name;
            if (braState.balls && braState.balls[i].done) {
                label += ` - ${braState.balls[i].finishTime.toFixed(1)}`;
            }
            ctx.fillText(label, 720, ly + 12);
        }

        ctx.fillStyle = "#aaa";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("The cycloid (green) is always the fastest path!", W / 2, H - 15);

        overlay.innerHTML =
            `<b style="color:#4caf50">Brachistochrone</b><br>` +
            `g: ${g} m/s² | Height: ${endH}px<br>` +
            `Fastest descent curve comparison`;

        animId = requestAnimationFrame(drawBrachistochrone);
    }
    bindSlider("bra-g", "val-bra-g");
    bindSlider("bra-h", "val-bra-h");
    document.getElementById("btn-bra-go").addEventListener("click", () => {
        braState.racing = true;
        braState.t = 0;
        braState.balls = [
            { dist: 0, done: false, finishTime: 0 },
            { dist: 0, done: false, finishTime: 0 },
            { dist: 0, done: false, finishTime: 0 }
        ];
    });
    document.getElementById("btn-bra-reset").addEventListener("click", initBrachistochrone);

    // ── 62. Brownian Motion ─────────────────────────────────
    let bmState = {};
    function initBrownian() {
        cancelAnimationFrame(animId);
        currentSim = "brownian";
        const count = parseInt(document.getElementById("bm-count").value);
        const molecules = [];
        for (let i = 0; i < count; i++) {
            molecules.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4
            });
        }
        bmState = {
            pollen: { x: canvas.width / 2, y: canvas.height / 2, vx: 0, vy: 0, trail: [] },
            molecules,
            msd: [],
            t: 0
        };
        drawBrownian();
    }
    function drawBrownian() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const temp = parseFloat(document.getElementById("bm-temp").value);
        const trailLen = parseInt(document.getElementById("bm-trail").value);
        const speed = Math.sqrt(temp / 300) * 3;
        const pollenR = 15, molR = 2;
        const p = bmState.pollen;

        bmState.t++;

        // Update molecules
        for (const m of bmState.molecules) {
            m.vx += (Math.random() - 0.5) * speed * 0.5;
            m.vy += (Math.random() - 0.5) * speed * 0.5;
            const spd = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
            if (spd > speed * 2) { m.vx *= speed * 2 / spd; m.vy *= speed * 2 / spd; }
            m.x += m.vx;
            m.y += m.vy;
            if (m.x < 0) { m.x = 0; m.vx *= -1; }
            if (m.x > W) { m.x = W; m.vx *= -1; }
            if (m.y < 0) { m.y = 0; m.vy *= -1; }
            if (m.y > H) { m.y = H; m.vy *= -1; }

            // Collision with pollen
            const dx = m.x - p.x, dy = m.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < pollenR + molR) {
                const nx = dx / dist, ny = dy / dist;
                p.vx -= nx * 0.3;
                p.vy -= ny * 0.3;
                m.vx += nx * 2;
                m.vy += ny * 2;
                m.x = p.x + nx * (pollenR + molR + 1);
                m.y = p.y + ny * (pollenR + molR + 1);
            }
        }

        // Update pollen
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < pollenR) { p.x = pollenR; p.vx *= -1; }
        if (p.x > W - pollenR) { p.x = W - pollenR; p.vx *= -1; }
        if (p.y < pollenR) { p.y = pollenR; p.vy *= -1; }
        if (p.y > H - pollenR) { p.y = H - pollenR; p.vy *= -1; }

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > trailLen) p.trail.shift();

        // MSD tracking
        const dx0 = p.x - W / 2, dy0 = p.y - H / 2;
        bmState.msd.push(dx0 * dx0 + dy0 * dy0);
        if (bmState.msd.length > 500) bmState.msd.shift();

        // Draw molecules
        for (const m of bmState.molecules) {
            ctx.beginPath();
            ctx.arc(m.x, m.y, molR, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(100,180,255,0.4)";
            ctx.fill();
        }

        // Draw pollen trail
        if (p.trail.length > 1) {
            ctx.beginPath();
            for (let i = 1; i < p.trail.length; i++) {
                const alpha = i / p.trail.length;
                ctx.strokeStyle = `rgba(255,235,59,${alpha * 0.7})`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(p.trail[i - 1].x, p.trail[i - 1].y);
                ctx.lineTo(p.trail[i].x, p.trail[i].y);
                ctx.stroke();
            }
        }

        // Draw pollen
        ctx.beginPath();
        ctx.arc(p.x, p.y, pollenR, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x - 3, p.y - 3, 2, p.x, p.y, pollenR);
        grad.addColorStop(0, "#ffe082");
        grad.addColorStop(1, "#f9a825");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = "#f57f17";
        ctx.lineWidth = 1;
        ctx.stroke();

        // MSD mini-graph
        if (bmState.msd.length > 10) {
            const mgx = W - 180, mgy = H - 120, mgw = 160, mgh = 100;
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(mgx, mgy, mgw, mgh);
            ctx.strokeStyle = "#555";
            ctx.strokeRect(mgx, mgy, mgw, mgh);
            ctx.fillStyle = "#aaa";
            ctx.font = "10px monospace";
            ctx.textAlign = "center";
            ctx.fillText("MSD (r²)", mgx + mgw / 2, mgy - 4);

            const maxMSD = Math.max(...bmState.msd, 1);
            ctx.beginPath();
            for (let i = 0; i < bmState.msd.length; i++) {
                const mx = mgx + (i / bmState.msd.length) * mgw;
                const my = mgy + mgh - (bmState.msd[i] / maxMSD) * mgh;
                if (i === 0) ctx.moveTo(mx, my);
                else ctx.lineTo(mx, my);
            }
            ctx.strokeStyle = "#ffd54f";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        const avgMSD = bmState.msd.length > 0 ? bmState.msd.reduce((a, b) => a + b) / bmState.msd.length : 0;
        overlay.innerHTML =
            `<b style="color:#ffd54f">Brownian Motion</b><br>` +
            `T: ${temp}K | Molecules: ${bmState.molecules.length}<br>` +
            `MSD: ${avgMSD.toFixed(0)} | t: ${bmState.t}`;

        animId = requestAnimationFrame(drawBrownian);
    }
    bindSlider("bm-temp", "val-bm-temp");
    bindSlider("bm-count", "val-bm-count");
    bindSlider("bm-trail", "val-bm-trail");
    document.getElementById("btn-bm-reset").addEventListener("click", initBrownian);

    // ── 63. Wave Packet ─────────────────────────────────────
    let wpState = {};
    function initWavePacket() {
        cancelAnimationFrame(animId);
        currentSim = "wavepacket";
        wpState = { t: 0 };
        drawWavePacket();
    }
    function drawWavePacket() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const k0 = parseFloat(document.getElementById("wp-k").value);
        const sigma0 = parseFloat(document.getElementById("wp-sigma").value);
        const disp = parseFloat(document.getElementById("wp-disp").value);
        wpState.t += 0.05;
        const t = wpState.t;

        const centerY = H * 0.35;
        const ampScale = 120;

        // Group and phase velocities
        const vPhase = 1 + disp * k0;
        const vGroup = 1 + 2 * disp * k0;

        // Dispersion broadening
        const sigmaT = sigma0 * Math.sqrt(1 + (disp * t / (sigma0 * sigma0)) ** 2);

        // Draw wave packet (real part)
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
            const x = px - W / 2;
            const xShifted = x - vGroup * t * 5;
            const envelope = Math.exp(-(xShifted * xShifted) / (2 * sigmaT * sigmaT));
            const phase = k0 * x - vPhase * t * 5 * k0;
            const re = envelope * Math.cos(phase);
            const py = centerY - re * ampScale;
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "#4fc3f7";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Imaginary part (faint)
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
            const x = px - W / 2;
            const xShifted = x - vGroup * t * 5;
            const envelope = Math.exp(-(xShifted * xShifted) / (2 * sigmaT * sigmaT));
            const phase = k0 * x - vPhase * t * 5 * k0;
            const im = envelope * Math.sin(phase);
            const py = centerY - im * ampScale;
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = "rgba(233,30,99,0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Envelope
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
            const x = px - W / 2;
            const xShifted = x - vGroup * t * 5;
            const envelope = Math.exp(-(xShifted * xShifted) / (2 * sigmaT * sigmaT));
            if (px === 0) ctx.moveTo(px, centerY - envelope * ampScale);
            else ctx.lineTo(px, centerY - envelope * ampScale);
        }
        for (let px = W - 1; px >= 0; px--) {
            const x = px - W / 2;
            const xShifted = x - vGroup * t * 5;
            const envelope = Math.exp(-(xShifted * xShifted) / (2 * sigmaT * sigmaT));
            ctx.lineTo(px, centerY + envelope * ampScale);
        }
        ctx.closePath();
        ctx.fillStyle = "rgba(79,195,247,0.08)";
        ctx.fill();

        // Probability density |ψ|²
        const probY = H * 0.75;
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
            const x = px - W / 2;
            const xShifted = x - vGroup * t * 5;
            const envelope = Math.exp(-(xShifted * xShifted) / (2 * sigmaT * sigmaT));
            const prob = envelope * envelope;
            const py = probY - prob * ampScale * 0.8;
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.lineTo(W, probY);
        ctx.lineTo(0, probY);
        ctx.closePath();
        ctx.fillStyle = "rgba(76,175,80,0.3)";
        ctx.fill();
        ctx.strokeStyle = "#4caf50";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let px = 0; px < W; px++) {
            const x = px - W / 2;
            const xShifted = x - vGroup * t * 5;
            const envelope = Math.exp(-(xShifted * xShifted) / (2 * sigmaT * sigmaT));
            const prob = envelope * envelope;
            const py = probY - prob * ampScale * 0.8;
            if (px === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Velocity markers
        const groupX = W / 2 + vGroup * t * 5;
        const phaseX = W / 2 + vPhase * t * 5;
        // Wrap markers
        const gxMod = ((groupX % W) + W) % W;
        const pxMod = ((phaseX % W) + W) % W;

        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "#ff9800";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gxMod, 10); ctx.lineTo(gxMod, centerY + ampScale); ctx.stroke();
        ctx.strokeStyle = "#e040fb";
        ctx.beginPath(); ctx.moveTo(pxMod, 10); ctx.lineTo(pxMod, centerY + ampScale); ctx.stroke();
        ctx.setLineDash([]);

        // Labels
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "#4fc3f7";
        ctx.fillText("ψ (Real)", 10, 25);
        ctx.fillStyle = "#e91e63";
        ctx.fillText("ψ (Imag)", 10, 42);
        ctx.fillStyle = "#4caf50";
        ctx.fillText("|ψ|²", 10, probY - ampScale * 0.7);
        ctx.fillStyle = "#ff9800";
        ctx.fillText("v_group", 10, 75);
        ctx.fillStyle = "#e040fb";
        ctx.fillText("v_phase", 10, 92);

        overlay.innerHTML =
            `<b style="color:#4fc3f7">Wave Packet</b><br>` +
            `k₀: ${k0} | σ₀: ${sigma0} | σ(t): ${sigmaT.toFixed(1)}<br>` +
            `v_phase: ${vPhase.toFixed(2)} | v_group: ${vGroup.toFixed(2)}<br>` +
            `Dispersion: ${disp}`;

        animId = requestAnimationFrame(drawWavePacket);
    }
    bindSlider("wp-k", "val-wp-k");
    bindSlider("wp-sigma", "val-wp-sigma");
    bindSlider("wp-disp", "val-wp-disp");
    document.getElementById("btn-wp-reset").addEventListener("click", initWavePacket);

    // ── 64. Trebuchet ───────────────────────────────────────
    let trebState = {};
    function initTrebuchet() {
        cancelAnimationFrame(animId);
        currentSim = "trebuchet";
        trebState = {
            angle: Math.PI * 0.4,  // arm angle from vertical
            angVel: 0,
            fired: false,
            projX: 0, projY: 0,
            projVX: 0, projVY: 0,
            projTrail: [],
            phase: "ready", // ready, swinging, flying
            maxDist: 0
        };
        drawTrebuchet();
    }
    function drawTrebuchet() {
        const W = canvas.width, H = canvas.height;
        ctx.fillStyle = "#0a0a2e";
        ctx.fillRect(0, 0, W, H);

        const cw = parseFloat(document.getElementById("treb-cw").value);
        const ratio = parseFloat(document.getElementById("treb-ratio").value);
        const pm = parseFloat(document.getElementById("treb-pm").value);
        const g = 9.8;

        const groundY = H - 60;
        const pivotX = 180, pivotY = groundY - 120;
        const shortArm = 40, longArm = shortArm * ratio;

        // Ground
        ctx.fillStyle = "#2d4a1e";
        ctx.fillRect(0, groundY, W, H - groundY);
        ctx.strokeStyle = "#4a7a2e";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();

        // Physics
        if (trebState.phase === "swinging") {
            // Torque from counterweight vs projectile
            const torque = (cw * g * shortArm * Math.sin(trebState.angle) - pm * g * longArm * Math.sin(trebState.angle));
            const I = cw * shortArm * shortArm + pm * longArm * longArm;
            const angAcc = torque / I;
            trebState.angVel -= angAcc * 0.001;
            trebState.angle += trebState.angVel * 0.05;

            // Release when arm passes near vertical
            if (trebState.angle < -0.3) {
                trebState.phase = "flying";
                const tipX = pivotX + longArm * Math.sin(-trebState.angle);
                const tipY = pivotY - longArm * Math.cos(-trebState.angle);
                trebState.projX = tipX;
                trebState.projY = tipY;
                const tangentSpeed = trebState.angVel * longArm;
                trebState.projVX = tangentSpeed * Math.cos(trebState.angle) * 15;
                trebState.projVY = tangentSpeed * Math.sin(trebState.angle) * 15;
            }
        }

        if (trebState.phase === "flying") {
            trebState.projVY += g * 0.03;
            trebState.projX += trebState.projVX * 0.3;
            trebState.projY += trebState.projVY * 0.3;
            trebState.projTrail.push({ x: trebState.projX, y: trebState.projY });
            if (trebState.projTrail.length > 500) trebState.projTrail.shift();

            if (trebState.projY >= groundY) {
                trebState.projY = groundY;
                trebState.phase = "landed";
                trebState.maxDist = trebState.projX - pivotX;
            }
        }

        // Draw frame
        ctx.strokeStyle = "#8d6e45";
        ctx.lineWidth = 4;
        // A-frame support
        ctx.beginPath();
        ctx.moveTo(pivotX - 40, groundY); ctx.lineTo(pivotX, pivotY);
        ctx.lineTo(pivotX + 40, groundY);
        ctx.stroke();

        // Draw arm
        const angle = trebState.angle;
        const cwX = pivotX - shortArm * Math.sin(angle);
        const cwY = pivotY + shortArm * Math.cos(angle);
        const tipX = pivotX + longArm * Math.sin(angle);
        const tipY = pivotY - longArm * Math.cos(angle);

        ctx.strokeStyle = "#a0845c";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cwX, cwY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Pivot point
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#888";
        ctx.fill();

        // Counterweight
        ctx.beginPath();
        ctx.arc(cwX, cwY, 12 + cw / 200, 0, Math.PI * 2);
        ctx.fillStyle = "#555";
        ctx.fill();
        ctx.strokeStyle = "#777";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = "#aaa";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`${cw}kg`, cwX, cwY + 4);

        // Sling/projectile on arm
        if (trebState.phase === "ready" || trebState.phase === "swinging") {
            // Sling rope
            const slingLen = 30;
            const slingX = tipX + slingLen * Math.sin(angle + 0.3);
            const slingY = tipY + slingLen * Math.cos(angle + 0.3);
            ctx.strokeStyle = "#aa8";
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(tipX, tipY); ctx.lineTo(slingX, slingY); ctx.stroke();
            ctx.beginPath();
            ctx.arc(slingX, slingY, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#e53935";
            ctx.fill();
        }

        // Flying projectile
        if (trebState.phase === "flying" || trebState.phase === "landed") {
            // Trail
            if (trebState.projTrail.length > 1) {
                ctx.beginPath();
                for (let i = 0; i < trebState.projTrail.length; i++) {
                    const pt = trebState.projTrail[i];
                    if (i === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                }
                ctx.strokeStyle = "rgba(229,57,53,0.5)";
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
            ctx.beginPath();
            ctx.arc(trebState.projX, trebState.projY, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#e53935";
            ctx.fill();
        }

        // Impact marker
        if (trebState.phase === "landed") {
            ctx.beginPath();
            ctx.arc(trebState.projX, groundY, 15, 0, Math.PI * 2);
            ctx.strokeStyle = "#ff0";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "#ff0";
            ctx.font = "14px monospace";
            ctx.textAlign = "center";
            ctx.fillText(`${trebState.maxDist.toFixed(0)} px`, trebState.projX, groundY - 25);
        }

        // Distance scale
        ctx.strokeStyle = "#444";
        ctx.lineWidth = 1;
        for (let d = 100; d < W; d += 100) {
            ctx.beginPath(); ctx.moveTo(d, groundY); ctx.lineTo(d, groundY + 8); ctx.stroke();
            ctx.fillStyle = "#555";
            ctx.font = "9px monospace";
            ctx.textAlign = "center";
            ctx.fillText(`${d}`, d, groundY + 18);
        }

        overlay.innerHTML =
            `<b style="color:#e53935">Trebuchet</b><br>` +
            `CW: ${cw}kg | Proj: ${pm}kg | Ratio: ${ratio}<br>` +
            `Phase: ${trebState.phase}` +
            (trebState.maxDist > 0 ? ` | Range: ${trebState.maxDist.toFixed(0)}px` : "");

        animId = requestAnimationFrame(drawTrebuchet);
    }
    bindSlider("treb-cw", "val-treb-cw");
    bindSlider("treb-ratio", "val-treb-ratio");
    bindSlider("treb-pm", "val-treb-pm");
    document.getElementById("btn-treb-fire").addEventListener("click", () => {
        if (trebState.phase !== "ready") initTrebuchet();
        setTimeout(() => { trebState.phase = "swinging"; }, 50);
    });
    document.getElementById("btn-treb-reset").addEventListener("click", initTrebuchet);

    // ── Start default simulation ────────────────────────────
    initProjectile();
})();
