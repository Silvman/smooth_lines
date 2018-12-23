'use strict';

let isDrawingMode = false;
let ox = 0;
let oy = 0;

let line_weight = 1;

let can_catch_pointer = true;

function dist(xa, ya, xb, yb) {
    return Math.sqrt((xa - xb) * (xa - xb) + (ya - yb) * (ya - yb));
}

function draw() {
    let canvas = document.getElementById('canvas');
    canvas.width = document.documentElement.clientWidth - 5;
    canvas.height = document.documentElement.clientHeight - 5;
    let ctx = canvas.getContext('2d');

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

        ox = e.pageX - x_offset;
        oy = e.pageY - y_offset;
    });

    canvas.addEventListener('mouseup', (e) => {
        isDrawingMode = false;

        let x = e.pageX - x_offset;
        let y = e.pageY - y_offset;

        ctx.beginPath();
        ctx.lineWidth = line_weight;
        ctx.lineCap = 'round';
        ctx.fillStyle = 'rgb(0,0,0)';
        ctx.moveTo(ox, oy);
        ctx.lineTo(x, y);
        ctx.stroke();
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawingMode && can_catch_pointer) {
            let x = e.pageX - x_offset;
            let y = e.pageY - y_offset;

            const d = dist(x, y, ox, oy);

            if (d > 40) {
                const dd = d - 40;
                const nx = ox + dd  * (x - ox) / d;
                const ny = oy + dd  * (y - oy) / d;


                ctx.beginPath();
                ctx.lineWidth = line_weight;
                ctx.lineCap = 'round';
                ctx.fillStyle = 'rgb(0,0,0)';
                ctx.moveTo(ox, oy);
                ctx.lineTo(nx, ny);
                ctx.stroke();

                ox = nx;
                oy = ny;
            }

        }
    });
}

document.addEventListener('DOMContentLoaded', draw);