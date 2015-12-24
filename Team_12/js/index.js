/*global $:false, d3:false, Firebase:false */

var DESC = {
    'type': [
        '休閒益智類',
        '體育類',
        '其他類',
        '冒險類',
        '動作類',
        '卡片類',
        '即時戰略類',
        '射擊類',
        '文字類',
        '格鬥類',
        '模擬類',
        '競速類',
        '策略類',
        '角色扮演類',
        '音樂類'
    ],
    'version': [
        '未知',
        '中文',
        '英文',
        '中+英文',
        '日文',
        '中+日文',
        '英+日文',
        '中+英+日文',
        '歐洲語言',
        '中文+歐洲語言',
        '英文+歐洲語言',
        '中+英文+歐洲語言',
        '日文+歐洲語言',
        '中+日文+歐洲語言',
        '英+日文+歐洲語言',
        '中+英+日文+歐洲語言'
    ],
    'platform': [
        '3DS',
        'GBA',
        'PC',
        'PS',
        'PS3',
        'PS4',
        'PSP',
        'PSV',
        'WII',
        'WII U',
        'XBOX 360',
        'XBOX ONE'
    ]
};
var POINT_COLOR = d3.scale.category20(),
    X_DEFAULT_DOMAIN = [new Date(343260800 * 1000), new Date(1481881600 * 1000)],
    Y_DEFAULT_DOMAIN = [Math.log10(100), Math.log10(2600000)],
    X_SCALE = d3.time.scale().range([20, $('svg').width() * 0.87]),
    Y_SCALE = d3.scale.linear().range([600, 100]);
var cata = 'type',
    current_scales,
    data,
    brush;

function updateScales(xDomain, yDomain) {
    'use strict';
    current_scales = [xDomain, yDomain];
    d3.select('g#xAxis')
        .transition()
        .call(d3.svg.axis()
             .scale(X_SCALE.domain(xDomain))
             .orient('bottom')
            );
    
    d3.select('g#yAxis')
        .transition()
        .call(d3.svg.axis()
             .scale(Y_SCALE.domain(yDomain))
             .orient('left')
            );
}

function updateMenu() {
    'use strict';
    var toggleCheckboxes;
    
    $('#checkbox-fields').empty();
    toggleCheckboxes = d3.select('div#checkbox-fields')
        .selectAll('div')
        .data(DESC[cata])
        .enter()
        .append('div')
        .classed('field', true)
        .style('margin-bottom', '3px')
        .append('div')
        .classed({
            'ui': true,
            'toggle': true,
            'checkbox': true
        });
    
    toggleCheckboxes.append('input')
        .attr({
            'type': 'checkbox',
            'checked': 'checked'
        })
        .attr('id', function (d, i) {
            return 'checkbox-' + i;
        });
    toggleCheckboxes.append('label')
        .attr('for', function (d, i) {
            return 'checkbox-' + i;
        })
        .style('color', function (d, i) {
            return POINT_COLOR(i);
        })
        .text(function (d) {
            return d;
        });
}

function updateFlot() {
    'use strict';
    var bounded = [
        [
            Math.floor(current_scales[0][0].getTime() / 1000),
            Math.floor(current_scales[0][1].getTime() / 1000)
        ],
        [
            Math.pow(10, current_scales[1][0]),
            Math.pow(10, current_scales[1][1])
        ]
    ],
        cnt = 0,
        keyword = $('input.prompt').val(),
        pattern = new RegExp(keyword, 'i');
    d3.selectAll('circle')
        .attr('fill', function (d) {
            return POINT_COLOR(d[cata]);
        })
        .attr('visibility', function (d) {
            if (d.time < bounded[0][0] || d.time > bounded[0][1] ||
                    d.view < bounded[1][0] || d.view > bounded[1][1]) {
                return 'hidden';
            } else if ($('input#checkbox-' + d[cata]).prop('checked')) {
                cnt += 1;
                return 'visible';
            } else {
                return 'hidden';
            }
        })
        .attr('cx', function (d) {
            return X_SCALE(new Date(d.time * 1000));
        })
        .attr('cy', function (d) {
            return Y_SCALE(Math.log10(d.view));
        })
        .attr('r', function (d) {
            var r;
            if (cnt > 100) {
                r = 3;
            } else {
                r = 10;
            }
            if (keyword !== '' && pattern.test(d.name)) {
                r *= 3;
            }
            return r;
        })
        .on('mousedown.display', function (d) {
            if (d.time > bounded[0][0] && d.time < bounded[0][1] &&
                    d.view > bounded[1][0] && d.view < bounded[1][1] &&
                    $('input#checkbox-' + d[cata]).prop('checked')) {
                $('.steps > .step > .content > .description:eq(0)').text(d.name);
                $('.steps > .step > .content > .description:eq(1)').text(DESC.type[d.type]);
                $('.steps > .step > .content > .description:eq(2)').text(DESC.version[d.version]);
                $('.steps > .step > .content > .description:eq(3)').text((new Date(d.time * 1000)).toDateString());
                $('.steps > .step > .content > .description:eq(4)').text(DESC.platform[d.platform]);
                $('.steps > .step > .content > .description:eq(5)').text(d.view);
            }
        });
}

function changeCata(div, ct) {
    'use strict';
    cata = ct;
    $('span#cata').html($(div).text());
    updateMenu();
    updateFlot();
}

function toggleAll() {
    'use strict';
    $('input[id^="checkbox"]').click();
}

function resetAll() {
    'use strict';
    //$('input[id^="checkbox"]').prop('checked', 'checked');
    $('input.prompt').val('');
    updateMenu();
    updateScales(X_DEFAULT_DOMAIN, Y_DEFAULT_DOMAIN);
    updateFlot();
}

function brushend() {
    'use strict';
    var scales = brush.extent();
    if (scales[0][0] > current_scales[0][0] && scales[1][0] < current_scales[0][1] &&
            scales[0][1] > current_scales[1][0] && scales[1][1] < current_scales[0][1] &&
            brush.empty() !== true) {
        updateScales([scales[0][0], scales[1][0]], [scales[0][1], scales[1][1]]);
        updateFlot();
    }
    brush.clear();
    $('.extent').attr('height', 0);
}

(function () {
    'use strict';

    $('body').append(
        '<div class="ui segment" id="wait">' +
            '   <div class="ui active dimmer">' +
            '       <div class="ui large text loader">Loading</div>' +
            '   </div>' +
            '</div>'
    );
    
    // Fetch data
    (new Firebase("https://burning-fire-3884.firebaseio.com/game")).startAt().limitToFirst(500).once('value', function (snapshot) {
        data = snapshot.val();
        $('#wait').remove();
    
        // Points
        d3.select('g.g-chart')
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle');
        
        updateFlot();
    });
    
    d3.select('g.g-chart').attr('transform', 'translate(90, -40)');
    
    // Axis labels
    d3.select('g.g-chart')
        .append('text')
        .attr({'id': 'xLabel', 'x': 450, 'y': 670})
        .text('時間');
    d3.select('g.g-chart')
        .append('text')
        .attr('id', 'yLabel')
        .attr('transform', 'translate(-60, 330) rotate(-90)')
        .text('瀏覽');
    
    // Axis scales
    d3.select('g.g-chart')
        .append('g')
        .attr('transform', 'translate(0, 630)')
        .attr('id', 'xAxis');
    d3.select('g.g-chart')
        .append('g')
        .attr('transform', 'translate(5, 0)')
        .attr('id', 'yAxis');
    updateScales(X_DEFAULT_DOMAIN, Y_DEFAULT_DOMAIN);
    
    // Brush
    brush = d3.svg.brush()
        .x(X_SCALE)
        .y(Y_SCALE)
        .on('brushend', brushend);
    d3.select('g.g-chart').call(brush);

    
    $("input.prompt").keyup(function (e) {
        if (e.keyCode === 13) {
            updateFlot();
        }
    });
    updateMenu();
}());
