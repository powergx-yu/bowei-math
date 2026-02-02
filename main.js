const mathApp = {
    grade: 2,
    xp: 0,
    currentProblem: null,
    weakPoints: {}, // 追踪错误类型
    autoSpeak: true, // 默认开启自动发音
    currentLessonUnit: null, // 当前显示的教学单元

    // 2-3年级教材数据（深度版）
    data: {
        grade2: [
            {
                id: 'g2_kakezan',
                title: 'かけ算の九九',
                concept: '同じ数を何度もたす代わりに「×」を使います。',
                fullConcept: '「1つ分」が「いくつ」あるかを考える計算です。例えば、2個入りの袋が3つあるとき、2+2+2と計算するよりも、2×3と書いたほうが簡単です。',
                steps: [
                    'まず「1つ分の数」を見つけます。',
                    '次に「いくつ分」あるかを数えます。',
                    'それを「×」でつなぎます。'
                ],
                examples: [
                    { q: 'リンゴが 3こずつ、4さら あります。', f: '3 × 4 = 12', a: '12こ' },
                    { q: '5円の切手が 6まい あります。', f: '5 × 6 = 30', a: '30円' }
                ],
                template: '1さらに ${a}こずつ ${b}さらあります。全部で何こですか？',
                type: 'mul',
                range: [2, 9]
            },
            {
                id: 'g2_length',
                title: '長さ（cmとmm）',
                concept: '1cmは10mmです。100cmは1mです。',
                fullConcept: '長さの単位にはいくつかあります。一番小さいのが「mm（ミリメートル）」、その次が「cm（センチメートル）」です。1cmは10mmと同じ長さです。',
                steps: [
                    'ものさしの「0」をはじっこにあわせます。',
                    'cmの大きなめもりを読みます。',
                    'のこった小さなめもり（mm）を読みます。'
                ],
                examples: [
                    { q: '3cm は 何mmですか？', f: '3 × 10 = 30', a: '30mm' },
                    { q: '25mm は 何cm何mmですか？', f: '20mm + 5mm', a: '2cm 5mm' }
                ],
                template: '${a}cm ${b}mm は 何mmですか？',
                type: 'unit_len',
                a_range: [2, 20],
                b_range: [1, 9]
            },
            {
                id: 'g2_addition_carry',
                title: 'たし算の筆算',
                concept: '位（くらい）をそろえて計算します。',
                fullConcept: '2けたの数のたし算は、「筆算（ひっさん）」を使うと便利です。一の位、十の位をたてにそろえて書くのがポイントです。',
                steps: [
                    '位をそろえて書きます。',
                    '一の位から計算します。',
                    '10をこえたら、十の位に「1」をくり上げます。',
                    '十の位を計算します。'
                ],
                examples: [
                    { q: '28 + 15 は？', f: '一の位: 8+5=13 (3を書いて1くり上げ), 十の位: 2+1+1=4', a: '43' }
                ],
                template: '${a} + ${b} は いくらですか？',
                type: 'add_carry',
                a_range: [10, 80],
                b_range: [10, 80]
            },
            {
                id: 'g2_subtraction_borrow',
                title: 'ひき算の筆算',
                concept: '上の位からかりてきて計算します。',
                fullConcept: 'ひき算の筆算でも、位をそろえることが一番大切です。引けないときは、おとなりの十の位から「10」をかりてきます。',
                steps: [
                    '位をそろえて書きます。',
                    '一の位が引けないときは、十の位から10をかりてきます。',
                    '一の位を計算します（10+数-数）。',
                    '十の位を計算します（1からひくのを忘れないで！）。'
                ],
                examples: [
                    { q: '42 - 18 は？', f: '2から8は引けないから10をかりる。一の位: 12-8=4, 十の位: 3-1=2', a: '24' }
                ],
                template: '${a} - ${b} は 残りいくらですか？',
                type: 'sub_borrow',
                a_range: [40, 99],
                b_range: [10, 39]
            },
            {
                id: 'g2_v_problem',
                title: '文章題（のこりは？）',
                concept: '「のこりは」と聞かれたら、ひき算を使います。',
                fullConcept: 'お話の中から「何算をするか」を見つけるのが文章題です。キーワードを見つけましょう。',
                steps: [
                    '問題文を読んで、何を聞かれているか確認します。',
                    '図（テープ図）を書いて、数の関係を整理します。',
                    '式を立てて、答えを求めます。'
                ],
                examples: [
                    { q: 'シールを 25まい 持っていました。7まい 使うと、のこりは？', f: '25 - 7 = 18', a: '18まい' }
                ],
                template: 'アメを ${a}こ持っていました。${b}こ食べました。のこりは何こですか？',
                type: 'sub_v'
            }
        ],
        grade3: [
            {
                id: 'g3_warizan',
                title: 'わり算（九九のぎゃく）',
                concept: 'わられる数の中に、わる数がいくつあるか考えます。',
                fullConcept: '全部の数を、同じ数ずつに「分ける」ときの計算です。九九の答えから、もとの数をさがすのがコツです。',
                steps: [
                    '全部でいくつあるかたしかめます。',
                    '何人で分ける（または何個ずつ分ける）か考えます。',
                    '九九を使って、答えを見つけます。'
                ],
                examples: [
                    { q: '12このお菓子を3人で分けると？', f: '12 ÷ 3 = 4', a: '1人 4こ' },
                    { q: '20ページを1日5ページずつ読むと？', f: '20 ÷ 5 = 4', a: '4日かかる' }
                ],
                template: '${a}このアメを ${b}人に同じ数ずつ分けると、1人何こですか？',
                type: 'div',
                range: [2, 9]
            },
            {
                id: 'g3_warizan_amari',
                title: 'わり算（あまりあり）',
                concept: 'わりきれないときは「あまり」を書きます。',
                fullConcept: '九九をがんばっても、ちょうど分けることができないことがあります。その残った分を「あまり」と呼びます。',
                steps: [
                    '九九を使って、わられる数を超えない一番近い答えをさがします。',
                    '引き算をして「あまり」を求めます。',
                    '「あまり」が「わる数」より小さくなっているか確認します。'
                ],
                examples: [
                    { q: '14 ÷ 3 は？', f: '3 × 4 = 12, 14 - 12 = 2', a: '4 あまり 2' }
                ],
                template: '${a} ÷ ${b} の 商（しょう）と あまりを求めてください。',
                type: 'div_rem',
                range: [2, 9]
            },
            {
                id: 'g3_fraction_basic',
                title: '分数の基礎',
                concept: '1つをいくつかに分けたうちの1つ分です。',
                fullConcept: '1よりも小さい数をあらわすときに「分数（ぶんすう）」を使います。半分なら 1/2（にぶんのいち）といいます。',
                steps: [
                    '元の形（1つ分）を思いかべます。',
                    'それをいくつに分けたか数えます。',
                    'そのうちの何個分かを書きます。'
                ],
                examples: [
                    { q: 'ケーキを 4つに切った うちの 1つ分は？', f: '4つに分けたうちの1つ', a: '1/4' }
                ],
                template: '1つを ${a}等分したうちの 1つ分を分数で書くと？ (解答は 1/${a} の形式)',
                type: 'frac_text',
                range: [2, 8]
            },
            {
                id: 'g3_time_calc',
                title: '時刻と時間',
                concept: '時計の針がどれくらい進むか考えます。',
                fullConcept: '1時間は60分です。これをおぼえておくと、お昼休みが何分か、何時に宿題が終わるかなどがわかります。',
                steps: [
                    '今の時刻を確認します。',
                    '何分たったかを計算します（60分を超えたら1時間増やします）。',
                    '長い針と短い針がどこにくるか想像します。'
                ],
                examples: [
                    { q: '10時40分 の 30分後の時刻は？', f: '40 + 30 = 70分 = 1時間10分', a: '11時10分' }
                ],
                template: '${a}时${b}分から ${c}分後の时刻は何时何分ですか？', // 注意保持原有属性名对应
                type: 'time_after',
                a_range: [1, 10],
                b_range: [10, 40],
                c_range: [10, 40]
            },
            {
                id: 'g3_decimal_basic',
                title: '小数の基礎',
                concept: '0.1は 1を10等分した数です。',
                fullConcept: '分数と同じように、1よりも小さい数を「小数（しょうすう）」でもあらわすことができます。0.1, 0.2 と数えます。',
                steps: [
                    '1を10個に分けた「1つ分」が 0.1 です。',
                    '0.1 がいくつ集まったか考えます。',
                    '「.（てん）」を忘れないように書きます。'
                ],
                examples: [
                    { q: '0.1 が 10こ集まると？', f: '0.1 × 10', a: '1' },
                    { q: '0.1 が 13こ集まると？', f: '1.0 + 0.3', a: '1.3' }
                ],
                template: '0.1 が ${a}こ集まると いくらになりますか？',
                type: 'decimal_intro',
                a_range: [2, 15]
            }
        ]
    },

    init() {
        this.bindEvents();
        this.renderUnits();
        this.updateStatsUI();
        this.switchView('learn');
    },

    loadStats() {
        const saved = JSON.parse(localStorage.getItem('boweri_math_stats') || '{"xp":0,"weak":{},"autoSpeak":true}');
        this.xp = saved.xp;
        this.weakPoints = saved.weak;
        this.autoSpeak = saved.autoSpeak !== undefined ? saved.autoSpeak : true;

        // 更新 UI 开关状态
        const toggle = document.getElementById('voice-auto-toggle');
        if (toggle) toggle.checked = this.autoSpeak;
    },

    saveStats() {
        localStorage.setItem('boweri_math_stats', JSON.stringify({
            xp: this.xp,
            weak: this.weakPoints,
            autoSpeak: this.autoSpeak
        }));
    },

    toggleAutoSpeak() {
        this.autoSpeak = document.getElementById('voice-auto-toggle').checked;
        this.saveStats();
        if (!this.autoSpeak) window.speechSynthesis.cancel();
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
        this.currentLessonUnit = unit;
        const modal = document.getElementById('lesson-detail');
        const content = document.getElementById('lesson-content');

        // 构建深度学习内容
        let stepsHtml = unit.steps ? unit.steps.map((s, i) => `<div class="step-item"><span>${i + 1}</span> ${s}</div>`).join('') : '';
        let examplesHtml = unit.examples ? unit.examples.map(ex => `
            <div class="example-card glass-container" style="background:white; margin-bottom:1rem; text-align:left;">
                <p><strong>問：</strong>${ex.q}</p>
                <p style="color:var(--primary); margin:10px 0;"><strong>式：</strong>${ex.f}</p>
                <p><strong>答え：</strong>${ex.a}</p>
            </div>
        `).join('') : '';

        // 在详情页顶部增加语音控制条
        const voiceControls = `
            <div class="lesson-voice-controls glass-container">
                <button class="btn-voice-manual" onclick="mathApp.speakCurrentLesson()">📢 今の説明を読み上げる</button>
                <div class="voice-toggle-mini">
                    <span>オート読み上げ</span>
                    <label class="switch is-mini">
                        <input type="checkbox" class="voice-auto-cb" ${this.autoSpeak ? 'checked' : ''} onchange="mathApp.syncAutoSpeak(this.checked)">
                        <span class="slider round"></span>
                    </label>
                </div>
            </div>
        `;

        content.innerHTML = `
            <div class="deep-lesson">
                ${voiceControls}
                <h1 style="color:var(--primary); margin-bottom:1.5rem;">${unit.title}</h1>
                
                <div class="lesson-section">
                    <h3>📖 【解説】こつ</h3>
                    <div class="glass-container" style="background:#fff9c4; font-size:1.2rem; line-height:1.7; text-align:left;">
                        ${unit.fullConcept || unit.concept}
                    </div>
                </div>

                ${stepsHtml ? `
                <div class="lesson-section" style="margin-top:2rem;">
                    <h3>💡 【ステップ】ときかた</h3>
                    <div class="steps-container">${stepsHtml}</div>
                </div>` : ''}

                ${examplesHtml ? `
                <div class="lesson-section" style="margin-top:2rem;">
                    <h3>📝 【例題】いっしょにやってみよう</h3>
                    <div>${examplesHtml}</div>
                </div>` : ''}

                <div style="margin-top:3rem;">
                    <button class="btn-primary" style="padding:1rem 4rem; font-size:1.6rem;" onclick="mathApp.startPracticeFromUnit('${unit.id}')">練習（れんしゅう）を始める</button>
                </div>
            </div>
        `;

        modal.classList.remove('hide');
        this.speak(unit.title + "。解説。" + (unit.fullConcept || unit.concept), true);
    },

    hideLesson() {
        window.speechSynthesis.cancel(); // 关闭弹窗时停止发音
        document.getElementById('lesson-detail').classList.add('hide');
        this.currentLessonUnit = null;
    },

    syncAutoSpeak(val) {
        this.autoSpeak = val;
        // 同步侧边栏的开关
        const sidebarToggle = document.getElementById('voice-auto-toggle');
        if (sidebarToggle) sidebarToggle.checked = val;
        this.saveStats();
        if (!val) window.speechSynthesis.cancel();
    },

    speakCurrentLesson() {
        if (this.currentLessonUnit) {
            this.speak(this.currentLessonUnit.title + "。解説。" + (this.currentLessonUnit.fullConcept || this.currentLessonUnit.concept));
        }
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

        this.speak(text, true);
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
            this.speak("正解です！", true);

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
            this.speak("残念、もう一度考えてみよう。", true);
        }
    },

    speakProblem() {
        if (this.currentProblem) {
            this.speak(this.currentProblem.text);
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

    speak(text, isAuto = false) {
        window.speechSynthesis.cancel();
        if (isAuto && !this.autoSpeak) return; // 如果是自动播报且关闭了开关，则不执行播报

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

    // 辅助函数：通过 ID 获取单元标题
    getUnitTitleById(id) {
        const allUnits = [...this.data.grade2, ...this.data.grade3];
        const unit = allUnits.find(u => u.id === id);
        return unit ? unit.title : id;
    },

    renderRecords() {
        const list = document.getElementById('weak-list');
        if (!list) return;
        list.innerHTML = '';
        for (const id in this.weakPoints) {
            const li = document.createElement('li');
            li.style.margin = "10px 0";
            li.style.fontSize = "1.2rem";
            li.innerHTML = `<strong>${this.getUnitTitleById(id)}</strong>: 失敗 ${this.weakPoints[id]}回`;
            list.appendChild(li);
        }
    },

    syncAutoSpeak(val) {
        this.autoSpeak = val;
        // 同步侧边栏的开关
        const sidebarToggle = document.getElementById('voice-auto-toggle');
        if (sidebarToggle) sidebarToggle.checked = val;
        this.saveStats();
        if (!val) window.speechSynthesis.cancel();
    },

    speakCurrentLesson() {
        if (this.currentLessonUnit) {
            this.speak(this.currentLessonUnit.title + "。解説。" + (this.currentLessonUnit.fullConcept || this.currentLessonUnit.concept));
        }
    }
};

mathApp.init();
