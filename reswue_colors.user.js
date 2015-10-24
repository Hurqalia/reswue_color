// ==UserScript==
// @id             iitc-plugin-reswue_colors
// @name           IITC plugin: ResWue Change links color
// @author         hurqalia22
// @category       Info
// @version        0.1.4.20150801.001
// @namespace      https://github.com/Hurqalia/reswue_colors
// @updateURL      https://github.com/Hurqalia/reswue_colors/raw/master/reswue_colors.meta.js
// @downloadURL    https://github.com/Hurqalia/reswue_colors/raw/master/reswue_colors.user.js
// @installURL     https://github.com/Hurqalia/reswue_colors/raw/master/reswue_colors.user.js
// @description    [hurqalia22-2015-08-01-001] Reswue Change links color
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none 
// ==/UserScript==              
                                
function wrapper(plugin_info) {
        if(typeof window.plugin !== 'function') window.plugin = function() {};
        plugin_info.buildName = 'hurqalia22';
        plugin_info.dateTimeVersion = '20150730.001';
        plugin_info.pluginId = 'reswue-colors';
        
        // PLUGIN START ////////////////////////////////////////////////////////
        // use own namespace for plugin
        window.plugin.reswue_colors                    = function() {};
        window.plugin.reswue_colors.KEY_DEFAULT_COLORS = 'plugin-reswue-colors-default';
        window.plugin.reswue_colors.KEY_CUSTOM_COLORS  = 'plugin-reswue-colors-custom';
        //window.plugin.reswue_colors.KEY            = {key: window.plugin.reswue_colors.CUSTOM_COLORS, field: 'colorsObj'};
        window.plugin.reswue_colors.colorsObj          = {};
        window.plugin.reswue_colors.is_new_color       = false;
                        
        // STORAGE //////////////////////////////////////////////////////////
                        
        // save the localStorage colors
        window.plugin.reswue_colors.saveCustomColors = function() {
                window.plugin.reswue_colors.saveStorage( window.plugin.reswue_colors.KEY_CUSTOM_COLORS );
                window.plugin.reswue_colors.setColorsToReswue();
        };

        // load the localStorage colors
        window.plugin.reswue_colors.loadCustomColors = function() {
                window.plugin.reswue_colors.loadStorage( window.plugin.reswue_colors.KEY_CUSTOM_COLORS );
        };      
                        
        // update the localStorage default reswue colors
        window.plugin.reswue_colors.saveDefaultColors = function() {
                window.plugin.reswue_colors.saveStorage( window.plugin.reswue_colors.KEY_DEFAULT_COLORS );
        };              
                
        // load the localStorage default reswue colors
        window.plugin.reswue_colors.loadDefaultColors = function() {
                window.plugin.reswue_colors.loadStorage( window.plugin.reswue_colors.KEY_DEFAULT_COLORS );
        };
                
        // save localStorage
        window.plugin.reswue_colors.saveStorage = function( key ) {
                localStorage[key] = JSON.stringify(window.plugin.reswue_colors.colorsObj[key]);
        };
        
        // load the localStorage 
        window.plugin.reswue_colors.loadStorage = function( key ) {
                if (localStorage[key]) {
                        window.plugin.reswue_colors.colorsObj[key] = JSON.parse(localStorage[key]);
                }
        };
        
        // FUNCTIONS ////////////////////////////////////////////////////////
        // init setup
        window.plugin.reswue_colors.setup  = function() {
                console.log('ResWue Colorizer');
                if (window.plugin.reswue && localStorage['reswue-environment']) {
                        window.plugin.reswue_colors.loadDefaultColors();
                        window.plugin.reswue_colors.loadCustomColors();
                        if (window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_DEFAULT_COLORS] === undefined) {
                                console.log('ResWue Colorizer - First time set default colors');
                                window.plugin.reswue_colors.getOriginalColors();
                                window.plugin.reswue_colors.saveDefaultColors();
                                window.plugin.reswue_colors.saveCustomColors();
                        } else {
                                console.log('ResWue Colorizer - Apply previous settings');
                                window.plugin.reswue_colors.setColorsToReswue();
                        }
                        window.plugin.reswue_colors.addButtons();
                } else {
                        alert('Reswue Color require Reswue plugin');
                }
        };

        // get reswue colors to init config
        window.plugin.reswue_colors.getOriginalColors = function() {
                var listLinkTypes = {};
                window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_DEFAULT_COLORS] = {};
                window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_CUSTOM_COLORS] = {};
                for(var key in window.plugin.reswue.layerManager.layerConfig) {
                        var layer_name  = window.plugin.reswue.layerManager.layerConfig[key].name;
                        var layer_color = window.plugin.reswue.layerManager.layerConfig[key].color;
                        window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_DEFAULT_COLORS][key] = { name : layer_name, color : layer_color };
                        window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_CUSTOM_COLORS][key]  = { name : layer_name, color : '' };

                }
        };

        // set reswue link config and redraw
        window.plugin.reswue_colors.setColorsToReswue = function() {
                window.plugin.reswue_colors.is_new_color = false;
                for(var key in window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_CUSTOM_COLORS]) {
                        if (window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_DEFAULT_COLORS][key].color != '') {
                                window.plugin.reswue.layerManager.layerConfig[key].color = window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_CUSTOM_COLORS][key].color;
                                window.plugin.reswue_colors.is_new_color = true;
                        }
                }
        };

        // toolbox menu
        window.plugin.reswue_colors.addButtons = function() {
                $('head').append('<style>.rc_block_layer_selected {width:120px;text-align:left;border:2px solid red;} .rc_block_layer {width:120px;text-align:left;border:2px solid #1C405B;} .rc_block_layer:hover {border:2px solid yellow;} .rc_block_layer_title {width:80px;text-align:left;padding:2px;display:inline-block;} .rc_block_layer_newcolor {display:inline-block;padding:2px;width:20px;margin-left:2px;} .rc_block_edit {display:inline-block;width:20px;border: 1px solid white;}</style>');
                $('div.leaflet-bar.leaflet-control').each(function() { 
                  var thisdiv  = $(this);
                  $(this).children().each(function() { 
                    if ($(this).attr('title') == 'RESWUE') { 
                        thisdiv.append('<a onclick="window.plugin.reswue_colors.dialogBox();" class="leaflet-bar-part" title="Color Picker" href="#"><img class="" id="reswue-btn-color-picker" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADcElEQVR42m1TbUyTVxR+7lsK7VtCdbJCq5iGMS3yMaizfGwtrctcsrngRAnoxqKJ2cBsuCmLETsojGXJZvzF3I/9WHQCYcGAc3GJwXZNgQqssOIH4hDKMAICW/pBP4D77uKIYXMn98nNObnn5J7znIfgP1bf8LmKXfsYchmUq+EpBifDJXP1qT/WvidrHUv9ZxUikehEvsGkSNmyVcrH8hzz4fP66OjISMhh65yhlH5VYz7d+FSBmto6s1aXc1yX/5K88+erGB25BYFSsAREiaPxvCYNxldfQ7/T6e13dp+x1H5a96RAtbmmMlOrtSgTVXLrtatQq5XQ63XYvDERWALG7k/Cau/G1OyfeP2t/Ri9N+J1D7hqG+otZ8nJU6dVVBC6St4uU3e0NUOzfROMJg0W/XPwPYxACBIkEB5x0evxY48Lt6Yf4c3iUrRcOD/OcaSAnPjk5LEt29IblsIhfibggfZdJeaGH2K+R4qlZQkgYmc5DD0VsE2egHNTE1iX/BxEoqiFO0NuC6n8uKq1wPRKkavPwXkKPFiniEXwmzCwEAVR9D8jirA5SFmBo3FaPAgE4FD48EJuPrVf77xMjn74kd1QYNIPDTrRXOJG3ABF0nccqOTf9AZJBIeEXcgmGjRndCPzxTz8YrvuIO+Vf2A3GI364ZsuNO2bQ6RnFkmNY6B8FBvxKkkC+xACqIh5HzueyUZ76k/QZG+H3Wp1kMNHyltNO3cW3R12c/358ZjgoyGp/h7ieS+WJTGP85cRhoyTo0r5BSKJ87j5rAsp6enU2slaKDt05FhGRmYDLxHznr9m0HewEA+6fgPf+C3E3mkIYgJK4vHyhgrok3JxO+ECFMmbEAiEFtyDgxZS+s5hFSGkq/TAAfWvrhvwbliPWeMbmLgzC9+1IXCTQIo8DVmqeCySyxCkfmTpctDS1DTO6Dc8bnJ/aVnlDp3OkpWVLXf22LDIMe5UqYhwm8HNUMQEPaDh22wjOeTpjRhwubx9fb21PzSfP/tklfcWHzTrDYbjObl58sn7v+Pu6D34/QG2zkCsTIbUtK3YmJSM3t4bXrvNduZS68W6p8RUWFRSzstkVbsL9yiS1WqpRCrlVuKhcIiOjY0Hr3S0Pwr4/V92tLV8/b9qXLHde4pX5LyXIW+NnKdX5dx2pb11cu37vwHR8VhEZ1dfigAAAABJRU5ErkJggg==" width="16" height="16" style="vertical-align:middle;align:center;"></a>');
                    }  
                });
            });
        };
        // DIALOG BOX ////////////////////////////////////////////////////////
        window.plugin.reswue_colors.dialogBox = function() {
                var html = '<div class="" style="vertical-align:top; width:420px; height:420px;">'
                         + '<div>Change links color</div>'
                         + '<div style="display:inline-block; position:relative; top:0px;" id="block-layers">';
                for(var key in window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_DEFAULT_COLORS]) {
                        var def_layer_name   = window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_DEFAULT_COLORS][key].name;
                        var def_layer_color  = window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_DEFAULT_COLORS][key].color;
                        var cust_layer_color = window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_CUSTOM_COLORS][key].color;

                        html += '<div onclick="window.plugin.reswue_colors.selectOriginal(this)" class="rc_block_layer" id="rc_' + key + '" data-layer-name="' + key + '" data-color="' + def_layer_color + '" data-new-color="' + (cust_layer_color ? cust_layer_color : '') + '">';
                        html += '<div class="rc_block_layer_title" style="background-color:' + def_layer_color + '">' + def_layer_name + '</div>';
                        html += '<div class="rc_block_layer_newcolor" style="background-color:' + (cust_layer_color ? cust_layer_color : '#dddddd') + '">&nbsp;</div>';
                        html += '</div>';
                }
                html += '</div>';
                html += '<div style="position:absolute; top:20px; left:150px;">';
                html += '<canvas id="rc_canvas" width="230" height="150"></canvas>';
                html += '<div>';
                html += '<div style="margin-bottom:2px;">Color code : <input name="newc" id="new-color-code" type="color-picker" value="" size="10">&nbsp<input type="button" onclick="window.plugin.reswue_colors.setSelectColor()" value="Set"/></div>';
                html += '<div style="margin-bottom:2px;">Layer selected : <span id="rc_ls_name" style="font-weight:bold;"></span></div>';
                html += '<div style="margin-bottom:2px;">Original layer color : <div class="rc_block_edit" id="rc_ls_original" data-selected-layer="">&nbsp;</div></div>';
                html += '<div style="margin-bottom:2px;">Modified layer color : <div class="rc_block_edit" id="rc_ls_new">&nbsp;</div></div>';
                html += '</div>';
                html += '</div>';

                dialog({
                        html: html,
                        id: 'dialog-reswue-color',
                        dialogClass: '',
                        title: 'Color Editor',
                        width: 420,
                        minHeight:420,
                        buttons:{
                                'OK' : function() {
                                        var is_modified = false;
                                        $('.rc_block_layer, .rc_block_layer_selected').each(function() {
                                                var layer_name  = $(this).attr('data-layer-name');
                                                var layer_color = $(this).attr('data-new-color');
                                                if ((window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_CUSTOM_COLORS][layer_name].color != layer_color) && (layer_color != '')) {
                                                        is_modified = true;
                                                        window.plugin.reswue_colors.colorsObj[window.plugin.reswue_colors.KEY_CUSTOM_COLORS][layer_name].color = layer_color;
                                                }
                                        });
                                        if (is_modified) {
                                                window.plugin.reswue_colors.saveCustomColors();
                                                // if active operation, redraw
                                                if ((localStorage['reswue-operation'] !== undefined) && (localStorage['reswue-operation'] != '') && (window.plugin.reswue_colors.is_new_color)) {
                                                        window.plugin.reswue.data.updateLinks(window.plugin.reswue.data.links);
                                                }
                                        } else {
                                                alert('nothing to save...');
                                        }
                                        $(this).dialog('close');
                                },
                                'Cancel' : function(){
                                        $(this).dialog('close');
                                }
                        }
                });

                window.plugin.reswue_colors.PICKER.bind_inputs();
                $('input[type="color-picker"]').click();
        };

        // layer selector
        window.plugin.reswue_colors.selectOriginal = function(element) {
                var selected_block_id  = $(element).attr('id');
                var original_color     = $(element).attr('data-color');
                var new_color          = $(element).attr('data-new-color');
                var layer_name         = $(element).find('.rc_block_layer_title').html();
                var previous_selection = $('#rc_ls_original').attr('data-selected-layer');

                if (previous_selection != selected_block_id) {
                        if (previous_selection != '') {
                                $('#' + previous_selection).removeClass('rc_block_layer_selected');
                                $('#' + previous_selection).addClass('rc_block_layer');
                        }

                        $('#rc_ls_name').html(layer_name);
                        $('#rc_ls_original').css({ 'background-color' : original_color });
                        if (new_color != '') {
                                $('#rc_ls_new').css({ 'background-color' : new_color });
        $(element).attr('data-new-color', new_color);
                        }

                        $(element).removeClass('rc_block_layer');
                        $(element).addClass('rc_block_layer_selected');

                        $('#rc_ls_original').attr('data-selected-layer', selected_block_id);
                }
        };

        // select color 
        window.plugin.reswue_colors.setSelectColor = function() {
                if ($('#rc_ls_original').attr('data-selected-layer') == '') {
                        alert('Please, select a layer to change the color');
                        return false;
                }
                if ($('#new-color-code').val() == '') {
                        alert('Please, use picker to select a new color');
                        return false;
                }
                var new_color = $('#new-color-code').val();
                $('#rc_ls_new').css({ 'background-color' : new_color });
                $('#' + $('#rc_ls_original').attr('data-selected-layer'))
                        .find('.rc_block_layer_newcolor')
                        .css({ 'background-color' : new_color });
                $('#' + $('#rc_ls_original').attr('data-selected-layer')).attr('data-new-color', new_color);
        };

        // color picker
        window.plugin.reswue_colors.PICKER = {
                mouse_inside: false,
                to_hex: function (dec) {
                        hex = dec.toString(16);
                        return hex.length == 2 ? hex : '0' + hex;
                },
                show: function () {
                        var input = $(this);

                        window.plugin.reswue_colors.PICKER.$colors  = $('#rc_canvas');
                        window.plugin.reswue_colors.PICKER.$colors.css({ 'border': '1px solid black', 'cursor': 'crosshair', 'display': 'none' });
                        $('#picker-locate').append(window.plugin.reswue_colors.PICKER.$colors.fadeIn());
                        window.plugin.reswue_colors.PICKER.colorctx = window.plugin.reswue_colors.PICKER.$colors[0].getContext('2d');
                        window.plugin.reswue_colors.PICKER.render();
                        window.plugin.reswue_colors.PICKER.$colors
                                .click(function (e) {
                                        var new_color = window.plugin.reswue_colors.PICKER.get_color(e);

                                        $(input).css({'background-color': new_color}).val(new_color).trigger('change').removeClass('color-picker-binded');
                                })
                                .hover(function () {
                                        window.plugin.reswue_colors.PICKER.mouse_inside=true;
                                }, function () {
                                        window.plugin.reswue_colors.PICKER.mouse_inside=false;
                                });
                },
                bind_inputs: function () {
                        $('input[type="color-picker"]').not('.color-picker-binded').each(function () {
                                $(this).click(window.plugin.reswue_colors.PICKER.show);
                        }).addClass('color-picker-binded');
                },
                get_color: function (e) {
                        var offSet = window.plugin.reswue_colors.PICKER.$colors.offset();
                        var pos_x  = e.pageX - offSet.left;
                        var pos_y  = e.pageY - offSet.top;

                        data = window.plugin.reswue_colors.PICKER.colorctx.getImageData(pos_x, pos_y, 1, 1).data;
                        return '#' + window.plugin.reswue_colors.PICKER.to_hex(data[0]) + window.plugin.reswue_colors.PICKER.to_hex(data[1]) + window.plugin.reswue_colors.PICKER.to_hex(data[2]);
                },
                render: function () {
                        var gradient = window.plugin.reswue_colors.PICKER.colorctx.createLinearGradient(0, 0, window.plugin.reswue_colors.PICKER.$colors.width(), 0);

                        gradient.addColorStop(0,    "rgb(255,   0,   0)");
                        gradient.addColorStop(0.15, "rgb(255,   0, 255)");
                        gradient.addColorStop(0.33, "rgb(0,     0, 255)");
                        gradient.addColorStop(0.49, "rgb(0,   255, 255)");
                        gradient.addColorStop(0.67, "rgb(0,   255,   0)");
                        gradient.addColorStop(0.84, "rgb(255, 255,   0)");
                        gradient.addColorStop(1,    "rgb(255,   0,   0)");
                        window.plugin.reswue_colors.PICKER.colorctx.fillStyle = gradient;
                        window.plugin.reswue_colors.PICKER.colorctx.fillRect(0, 0, window.plugin.reswue_colors.PICKER.colorctx.canvas.width, window.plugin.reswue_colors.PICKER.colorctx.canvas.height);
                        gradient = window.plugin.reswue_colors.PICKER.colorctx.createLinearGradient(0, 0, 0, window.plugin.reswue_colors.PICKER.$colors.height());
                        gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
                        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
                        gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
                        gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");
                        window.plugin.reswue_colors.PICKER.colorctx.fillStyle = gradient;
                        window.plugin.reswue_colors.PICKER.colorctx.fillRect(0, 0, window.plugin.reswue_colors.PICKER.colorctx.canvas.width, window.plugin.reswue_colors.PICKER.colorctx.canvas.height);
                }
        };

        // runrun
        var setup =  window.plugin.reswue_colors.setup;

        setup.info = plugin_info; //add the script info data to the function as a property
        if(!window.bootPlugins) window.bootPlugins = [];
        window.bootPlugins.push(setup);
        // if IITC has already booted, immediately run the 'setup' function
        if(window.iitcLoaded && typeof setup === 'function') {
                setup();
        }

    // PLUGIN END ////////////////////////////////////////////////////////    
} // WRAPPER END ////////////////////////////////////////////////////////    

var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);

