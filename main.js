const mathApp = {
    grade: 2,
    xp: 0,
    currentProblem: null,
    weakPoints: {}, // 追踪错误类型

    // 2-3年级教材数据
    data: {
        grade2: [
            { id: 'g2_kakezan', title: 'かけ算の九九', concept: '同じ数を何度もたす代わりに「×」を使います。', template: '1さらに ${a}こずつ ${b}さらあります。全部で何こですか？', type: 'mul', range: [2, 9] },
            { id: 'g2_length', title: '長さ（cmとmm）', concept: '1cmは10mmです。100cmは1mです。', template: '${a}cm ${b}mm は 何mmですか？', type: 'unit_len', a_range: [2, 20], b_range: [1, 9] },
            { id: 'g2_addition_carry', title: 'たし算の筆算', concept: '位（くらい）をそろえて計算します。', template: '${a} + ${b} は いくらですか？', type: 'add_carry', a_range: [10, 80], b_range: [10, 80] },
            { id: 'g2_subtraction_borrow', title: 'ひき算の筆算', concept: '上の位からかりてきて計算します。', template: '${a} - ${b} は 残りいくらですか？', type: 'sub_borrow', a_range: [40, 99], b_range: [10, 39] },
            { id: 'g2_v_problem', title: '文章題（のこりは？）', concept: '「のこりは」と聞かれたら、ひき算を使います。', template: 'アメを ${a}こ持っていました。${b}こ食べました。のこりは何こですか？', type: 'sub_v' }
        ],
        grade3: [
            { id: 'g3_warizan', title: 'わり算（九九のぎゃく）', concept: 'わられる数の中に、わる数がいくつあるか考えます。', template: '${a}このアメを ${b}人に同じ数ずつ分けると、1人何こですか？', type: 'div', range: [2, 9] },
            { id: 'g3_warizan_amari', title: 'わり算（あまりあり）', concept: 'わりきれないときは「あまり」を書きます。', template: '${a} ÷ ${b} の 商（しょう）と あまりを求めてください。', type: 'div_rem', range: [2, 9] },
            { id: 'g3_fraction_basic', title: '分数の基礎', concept: '1つをいくつかに分けたうちの1つ分です。', template: '1つを ${a}等分したうちの 1つ分を分数で書くと？ (解答は 1/${a} の形式)', type: 'frac_text', range: [2, 8] },
            { id: 'g3_time_calc', title: '時刻と時間（後の時刻）', concept: '時計の針がどれくらい進むか考えます。', template: '${a}時${b}分から ${c}分後の時刻は何時何分ですか？', type: 'time_after', a_range: [1, 10], b_range: [10, 40], c_range: [10, 40] },
            { id: 'g3_decimal_basic', concept: '0.1は 1を10等分した数です。', template: '0.1 が ${a}こ集まると いくらになりますか？', type: 'decimal_intro', a_range: [2, 15] }
        ]
    },

    init() {
        this.loadStats();
        this.bindEvents();
        this.renderUnits();
        this.updateStatsUI();
        this.switchView('learn');
    },

    loadStats() {
        const saved = JSON.parse(localStorage.getItem('boweri_math_stats') || '{"xp":0,"weak":{}}');
        this.xp = saved.xp;
        this.weakPoints = saved.weak;
    },

    saveStats() {
        localStorage.setItem('boweri_math_stats', JSON.stringify({ xp: this.xp, weak: this.weakPoints }));
    },

    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.switchView(item.dataset.view);
            });
        });
    },

    switchView(viewId) {
        window.speechSynthesis.cancel(); // 切换页面时停止发音
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) targetView.classList.add('active');
        this.currentView = viewId;

        if (viewId === 'practice') this.generateProblem();
        if (viewId === 'record') this.renderRecords();
    },

    setGrade(g) {
        this.grade = g;
        document.getElementById('btn-grade2').classList.toggle('active', g === 2);
        document.getElementById('btn-grade3').classList.toggle('active', g === 3);
        this.renderUnits();
        if (this.currentView === 'practice') this.generateProblem();
    },

    renderUnits() {
        const container = document.getElementById('unit-list');
        if (!container) return;
        container.innerHTML = '';
        const units = this.data[`grade${this.grade}`] || [];
        units.forEach(u => {
            const card = document.createElement('div');
            card.className = 'glass-container lesson-card';
            card.innerHTML = `<h3>${u.title}</h3><p style="color:var(--text-sub); font-size:0.9rem; margin-top:10px;">学習をはじめる</p>`;
            card.onclick = () => this.showLesson(u);
            container.appendChild(card);
        });
    },

    showLesson(unit) {
        const modal = document.getElementById('lesson-detail');
        const content = document.getElementById('lesson-content');
        content.innerHTML = `
            <div style="text-align:center;">
                <h2 style="color:var(--primary);">${unit.title}</h2>
                <div class="glass-container" style="margin:2rem 0; font-size:1.4rem; line-height:1.8; text-align:left; background:rgba(255,255,255,0.9);">
                    <strong>【考え方】</strong><br>
                    ${unit.concept}
                </div>
                <button class="btn-primary" onclick="mathApp.startPracticeFromUnit('${unit.id}')">この練習（れんしゅう）へ</button>
            </div>
        `;
        modal.classList.remove('hide');
        this.speak(unit.title + "。考え方。" + unit.concept);
    },

    hideLesson() {
        window.speechSynthesis.cancel(); // 关闭弹窗时停止发音
        document.getElementById('lesson-detail').classList.add('hide');
    },

    startPracticeFromUnit(id) {
        this.hideLesson();
        this.switchView('practice');
        // 这里可以改进为只练习选中的单元
    },

    // 乱数题目生成引擎
    generateProblem() {
        const units = this.data[`grade${this.grade}`];
        // 自适应权重选择：如果某个单元在 weakPoints 中分值高，则更高概率选到
        let pool = [];
        units.forEach(u => {
            const weight = (this.weakPoints[u.id] || 0) + 1;
            for (let i = 0; i < weight; i++) pool.push(u);
        });
        const unit = pool[Math.floor(Math.random() * pool.length)];

        let a, b, c, ans, text, visual = '';

        switch (unit.type) {
            case 'mul':
                a = Math.floor(Math.random() * (unit.range[1] - 1)) + 2;
                b = Math.floor(Math.random() * 8) + 2;
                ans = a * b;
                text = unit.template.replace('${a}', a).replace('${b}', b);
                visual = this.createTapeDiagram(a, b);
                break;
            case 'unit_len':
                a = Math.floor(Math.random() * (unit.a_range[1] - unit.a_range[0] + 1)) + unit.a_range[0];
                b = Math.floor(Math.random() * (unit.b_range[1] - unit.b_range[0] + 1)) + unit.b_range[0];
                ans = a * 10 + b;
                text = unit.template.replace('${a}', a).replace('${b}', b);
                break;
            case 'add_carry':
                a = Math.floor(Math.random() * (unit.a_range[1] - unit.a_range[0] + 1)) + unit.a_range[0];
                b = Math.floor(Math.random() * (unit.b_range[1] - unit.b_range[0] + 1)) + unit.b_range[0];
                ans = a + b;
                text = unit.template.replace('${a}', a).replace('${b}', b);
                break;
            case 'sub_borrow':
                a = Math.floor(Math.random() * (unit.a_range[1] - unit.a_range[0] + 1)) + unit.a_range[0];
                b = Math.floor(Math.random() * (unit.b_range[1] - unit.b_range[0] + 1)) + unit.b_range[0];
                if (a < b) [a, b] = [b, a]; // Ensure a is greater than b
                ans = a - b;
                text = unit.template.replace('${a}', a).replace('${b}', b);
                break;
            case 'sub_v': // 文章题
                a = Math.floor(Math.random() * 30) + 20;
                b = Math.floor(Math.random() * (a - 10)) + 5; // b must be less than a
                ans = a - b;
                text = unit.template.replace('${a}', a).replace('${b}', b);
                break;
            case 'div':
                b = Math.floor(Math.random() * (unit.range[1] - 1)) + 2;
                ans = Math.floor(Math.random() * 8) + 2;
                a = b * ans;
                text = unit.template.replace('${a}', a).replace('${b}', b);
                break;
            case 'div_rem':
                b = Math.floor(Math.random() * (unit.range[1] - 1)) + 2;
                let quotient = Math.floor(Math.random() * 8) + 2;
                let remainder = Math.floor(Math.random() * (b - 1)) + 1; // remainder > 0 and < b
                a = b * quotient + remainder;
                ans = `${quotient}あまり${remainder}`; // Answer format: "商あまり余り"
                text = unit.template.replace('${a}', a).replace('${b}', b);
                break;
            case 'frac_text':
                a = Math.floor(Math.random() * (unit.range[1] - unit.range[0] + 1)) + unit.range[0];
                ans = `1/${a}`;
                text = unit.template.replace('${a}', a);
                break;
            case 'time_after':
                a = Math.floor(Math.random() * (unit.a_range[1] - unit.a_range[0] + 1)) + unit.a_range[0];
                b = Math.floor(Math.random() * (unit.b_range[1] - unit.b_range[0] + 1)) + unit.b_range[0];
                c = Math.floor(Math.random() * (unit.c_range[1] - unit.c_range[0] + 1)) + unit.c_range[0];
                let totalMin = b + c;
                let hPlus = Math.floor(totalMin / 60);
                let mRem = totalMin % 60;
                let finalHour = (a + hPlus) % 12; // Handle 12-hour format, assuming 1-12
                if (finalHour === 0) finalHour = 12;
                ans = `${finalHour}${mRem < 10 ? '0' : ''}${mRem}`; // 暗示输入如 920
                text = unit.template.replace('${a}', a).replace('${b}', b).replace('${c}', c);
                break;
            case 'decimal_intro':
                a = Math.floor(Math.random() * (unit.a_range[1] - unit.a_range[0] + 1)) + unit.a_range[0];
                ans = (a * 0.1).toFixed(1);
                text = unit.template.replace('${a}', a);
                break;
            default:
                a = 10; b = 5; ans = 15; text = "10 + 5 は？";
        }

        this.currentProblem = { unit, ans, text, a, b, c };
        document.getElementById('p-text').innerText = text;
        document.getElementById('p-visual').innerHTML = visual;
        document.getElementById('p-input').value = '';
        document.getElementById('p-input').type = (unit.type === 'frac_text' || unit.type === 'div_rem' || unit.type === 'time_after') ? 'text' : 'number';
        document.getElementById('feedback').innerText = '';
        document.getElementById('p-explain').classList.add('hide');

        this.speak(text);
    },

    createTapeDiagram(part, count) {
        let html = '<div class="tape-diagram">';
        const colors = ['#4a7c59', '#74b9ff', '#fab1a0', '#55efc4'];
        for (let i = 0; i < count; i++) {
            html += `<div class="tape-part" style="flex:1; background:${colors[i % colors.length]}; border-right:1px solid white">${part}</div>`;
        }
        html += '</div>';
        return html;
    },

    checkAnswer() {
        let userVal = document.getElementById('p-input').value.trim();
        const fb = document.getElementById('feedback');
        const p = this.currentProblem;

        // 如果是数字类型，转换为数字比较；否则字符串比较
        let isCorrect = (userVal == p.ans);

        if (isCorrect) {
            fb.innerHTML = '<span style="color:green; font-size:2rem;">⭕ 正解です！</span>';
            this.xp += 10;
            this.saveStats();
            this.updateStatsUI();
            this.speak("正解です！");

            if (this.challengeState.active) {
                this.challengeState.count++;
                if (this.challengeState.count >= 10) {
                    setTimeout(() => this.finishChallenge(), 1000);
                    return;
                }
            }
            setTimeout(() => this.generateProblem(), 1500);
        } else {
            fb.innerHTML = '<span style="color:red; font-size:2rem;">❌ おしい！</span>';
            this.showExplain();
            this.weakPoints[p.unit.id] = (this.weakPoints[p.unit.id] || 0) + 1;
            this.saveStats();
            this.speak("残念、もう一度考えてみよう。");
        }
    },

    showExplain() {
        const exp = document.getElementById('p-explain');
        const txt = document.getElementById('explain-text');
        const p = this.currentProblem;
        let explain = "";

        switch (p.unit.type) {
            case 'mul':
                explain = `${p.a}が ${p.b}こあるので、${p.a} × ${p.b} = ${p.ans} になります。全部で${p.ans}こです。`;
                break;
            case 'unit_len':
                explain = `1cmは10mmだから、${p.a}cmは${p.a * 10}mmです。それに${p.b}mmをたすと、${p.ans}mmになります。`;
                break;
            case 'add_carry':
                explain = `${p.a} ＋ ${p.b} は、筆算（ひっさん）で位をそろえて計算すると ${p.ans} になるよ。`;
                break;
            case 'sub_borrow':
                explain = `${p.a} － ${p.b} は、上の位から10かりてきて計算すると ${p.ans} だね。`;
                break;
            case 'sub_v':
                explain = `「のこりは」を聞かれているからひき算だね。${p.a} － ${p.b} ＝ ${p.ans}。答えは${p.ans}こ。`;
                break;
            case 'div':
                explain = `${p.b}に何をかけたら${p.a}になるかな？ 九九の${p.b}のだんを思いだして。${p.b} × ${p.ans} ＝ ${p.a} だから、答えは ${p.ans}。`;
                break;
            case 'div_rem':
                explain = `${p.a} ÷ ${p.b} は、${p.b}×${p.ans.split('あまり')[0]}＝${p.b * parseInt(p.ans)} で、あと ${p.ans.split('あまり')[1]} 足りないね。だから ${p.ans} だよ。`;
                break;
            case 'time_after':
                explain = `${p.b}分に${p.c}分をたすと${p.b + p.c}分。60分で1時間増えるから、時刻は ${p.ans.slice(0, -2)}時${p.ans.slice(-2)}分になるよ。`;
                break;
            default:
                explain = `正解は ${p.ans} です。よく見直してみよう！`;
        }
        txt.innerText = explain;
        exp.classList.remove('hide');
    },

    // 挑战模式
    challengeState: { active: false, count: 0, timer: 0, interval: null },

    startChallenge() {
        this.challengeState = { active: true, count: 0, timer: 0, interval: null };
        this.challengeState.interval = setInterval(() => {
            this.challengeState.timer++;
            const tVal = document.getElementById('time-val');
            if (tVal) tVal.innerText = this.challengeState.timer;
        }, 1000);

        // 切换到练习视图，但显示为挑战模式
        this.switchView('practice');
        document.getElementById('practice-head').innerText = '🏆 10問チャレンジ';
        document.getElementById('challenge-timer').classList.remove('hide');
    },

    finishChallenge() {
        clearInterval(this.challengeState.interval);
        alert(`お疲れ様！${this.challengeState.timer}秒で 10問クリア！ ボーナスXP +50!`);
        this.xp += 50;
        this.saveStats();
        this.updateStatsUI();
        this.challengeState.active = false;

        // 回到初始状态
        document.getElementById('practice-head').innerText = '✏️ れんしゅうトレーニング';
        document.getElementById('challenge-timer').classList.add('hide');
        this.switchView('challenge');
    },

    speak(text) {
        const uttr = new SpeechSynthesisUtterance(text);
        uttr.lang = 'ja-JP';
        uttr.rate = 0.9;
        window.speechSynthesis.speak(uttr);
    },

    speakExplain() {
        this.speak(document.getElementById('explain-text').innerText);
    },

    updateStatsUI() {
        document.getElementById('xp-val').innerText = this.xp;
    },

    renderRecords() {
        const list = document.getElementById('weak-list');
        list.innerHTML = '';
        for (const id in this.weakPoints) {
            const li = document.createElement('li');
            li.style.margin = "10px 0";
            li.innerText = `${id}: 失敗 ${this.weakPoints[id]}回`;
            list.appendChild(li);
        }
    }
};

mathApp.init();
