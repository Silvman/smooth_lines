'use strict';

let isDrawingMode = false;

let line_weight = 10;

let m_x = 0;
let m_y = 0;

let px = 0, py = 0;

function dist(xa, ya, xb, yb) {
    return Math.sqrt((xa - xb) * (xa - xb) + (ya - yb) * (ya - yb));
}

let canvas, ctx;

function update(ox, oy, x, y) {
    if (px === 0 && py === 0) {
        px = (x + ox) / 2;
        py = (y + oy) / 2;
    } else {
        let k = (oy - py) / (ox - px);
        let dist = ((x - ox) * (x - ox) + (y - oy) * (y - oy)) / 16;

        if (Math.abs(k) > 1) {
            k = 1 / k;

            let a = 1;
            let b = -2 * oy;

            let dis = 4 * dist / (1 + k * k);
            let t1 = (-b + Math.sqrt(dis)) / 2 * a;
            let t2 = (-b - Math.sqrt(dis)) / 2 * a;

            if (y >= oy) {
                py = t1;
            } else {
                py = t2;
            }

            px = (py - oy) * k + ox;
        } else {
            let a = 1;
            let b = -2 * ox;

            let dis = 4 * dist / (1 + k * k);

            let t1 = (-b + Math.sqrt(dis)) / 2 * a;
            let t2 = (-b - Math.sqrt(dis)) / 2 * a;

            if (x >= ox) {
                px = t1
            } else {
                px = t2;
            }

            py = (px - ox) * k + oy;
        }
    }

    if (Number.isNaN(px) || Number.isNaN(py)) {
        console.log(new Error("Nan"));
        px = (x + ox) / 2;
        py = (y + oy) / 2;
    }

}

function prepare() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = document.documentElement.clientWidth - 5;
    canvas.height = document.documentElement.clientHeight - 5;

    const x_offset = Math.floor(canvas.getBoundingClientRect().left);
    const y_offset = Math.floor(canvas.getBoundingClientRect().top);

    canvas.addEventListener('wheel', (e) => {
        console.log(e);
        if (e.deltaY < 0) {
            line_weight++;
        } else {
            if (line_weight > 1) {
                line_weight--;
            }
        }
    });

    canvas.addEventListener('mousedown', (e) => {
        isDrawingMode = true;

        m_x = e.pageX - x_offset;
        m_y = e.pageY - y_offset;

        time = Date.now();

        s_x = m_x;
        s_y = m_y;

        requestAnimationFrame(draw)
    });

    canvas.addEventListener('mouseup', (e) => {
        isDrawingMode = false;

        v_x = 0;
        v_y = 0;
    });

    canvas.addEventListener('mousemove', (e) => {
        m_x = e.pageX - x_offset;
        m_y = e.pageY - y_offset;
    });
}

let time = Date.now();
let s_x = 0, s_y = 0, v_x = 0, v_y = 0;

let t = 1;

function draw() {
    if (!isDrawingMode) {
        return;
    }

    const new_time = Date.now();
    const dt = new_time - time;
    time = new_time;

    const a_x = (m_x - s_x - 25 * v_x * dt) / (dt * dt);
    const a_y = (m_y - s_y - 25 * v_y * dt) / (dt * dt);




    // console.log(m_x, m_y, s_x, s_y)

    v_x += dt * a_x / 200;
    v_y += dt * a_y / 200;

    const o_x = s_x;
    const o_y = s_y;

    s_x += v_x * dt;
    s_y += v_y * dt;

    // console.log(a_x, a_y, v_x, v_y, o_x, o_y);

    let l_h = 20 * dist(0,0,v_x, v_y);
    if (l_h > 20) {
        l_h = 20;
    } else if (l_h < 5) {
        l_h = 5;
    }

// let l_h = 2;

    update(o_x, o_y, s_x, s_y);

    ctx.beginPath();
    ctx.lineWidth = l_h;
    ctx.lineCap = 'round';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.moveTo(o_x, o_y);
    ctx.quadraticCurveTo(px, py, s_x, s_y);
    ctx.stroke();

    requestAnimationFrame(draw)
}

document.addEventListener('DOMContentLoaded', prepare);