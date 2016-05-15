var multiplier = 1;
var divider = 1;

var myltiply_by = 1;
var number = 1;
var numbers = [];
var correct_answer_multiply = 1;
var correct_answer_divide = 1;

var error_count = 0;
var total_count = 0;

function random_question() {
	var tab_id = $("#tabs .ui-tabs-panel:visible").attr("id");
	$('#'+ tab_id + ' .result').prop('readonly', false);
	$('#'+ tab_id + ' .display_result').html('');
	do {
		number = Math.floor((Math.random() * 9) + 1);
	}
	while (numbers.indexOf(number) != -1);
	numbers.push(number);
	if (numbers.length > 8)
		numbers = [];

	var text = '';
	if (tab_id == 'multiply_tab') {
		correct_answer_multiply = multiplier * number;
		text = multiplier + ' × ' + number + ' = ';
	} else if (tab_id == 'divide_tab') {
		correct_answer_divide = number;
		var t = divider * number;
		text = '' + t + ' : ' + divider + ' = ';
	}
	var tab_id = $("#tabs .ui-tabs-panel:visible").attr("id");
	$('#'+ tab_id + ' .question').html(text);
	$('#'+ tab_id + ' .result').val('').focus().prop('readonly', false);
}

function check_answer() {
	var tab_id = $("#tabs .ui-tabs-panel:visible").attr("id");
	var result = $('#'+ tab_id + ' .result').val();
	if (!result)
		return;
	var text = '';
	var success;
	var correct_answer = tab_id == 'multiply_tab' ? correct_answer_multiply : (tab_id == 'divide_tab' ? correct_answer_divide : null);
	if (result == correct_answer) {
		text = 'Відповідь вірна!';
		$('#'+ tab_id + ' .result').prop('readonly', true);
		setTimeout(function(){ 
			random_question();
		}, 1500);
		success = true;
	} else {
		text = 'Відповідь не правильна!';
		$('#'+ tab_id + ' .result').val('').focus().prop('readonly', false);
		success = false;
		error_count += 1;
	}
	total_count += 1;
	play_sound(success);
	var log_text = '';
	if (tab_id == 'multiply_tab') {
		log_text = multiplier + ' × ' + number + ' = ' + result;
	} else if (tab_id == 'divide_tab') {
		log_text = divider * number + ' : ' + divider + ' = ' + result;
	}

	$('#results_list').append('<tr class="results_row ' + (success ? 'success' : 'error') + '"><td>' + log_text + '</td></tr>');
	if (error_count)
		$('#error_count').html('Помилок: ' + error_count);
	if (total_count)
		$('#total_count').html('Всього: ' + total_count);
	$('#'+ tab_id + ' .display_result').html(text);
}

function play_sound(success) {
	var audio = new Audio(success ? 'complete.wav' : 'error.wav');
	audio.play();
}

$(document).ready(function() {
	$('#tabs').tabs({ 
		activate: function(event, ui) {
        	$('#' + ui.newPanel[0].id + ' .result').focus();
        } 
    });
    // select multiplier
	$('.multiplier').click(function() {
		$('#multiply_tab .select_number').hide();
		$('#multiply_tab .question_section').show();
		$('#multiply_tab .question').html('');

		multiplier = this.id.split('-')[1];
		random_question();
	});
	// select divider
	$('.divider').click(function() {
		$('#divide_tab .select_number').hide();
		$('#divide_tab .question_section').show();
		$('#divide_tab .question').html('');

		divider = this.id.split('-')[1];
		random_question();
	});
	$('.back').click(function() {
		var tab_id = $("#tabs .ui-tabs-panel:visible").attr("id");
		$('#'+ tab_id + ' .select_number').show();
		$('#'+ tab_id + ' .question_section').hide();	
	});
	$('.result').change(function() {
		var tab_id = $("#tabs .ui-tabs-panel:visible").attr("id");
		$('#'+ tab_id + ' #display_result').html('');
	}).on("keypress", function(e) {
            /* ENTER PRESSED*/
            if (e.keyCode == 13) {
                /* FOCUS ELEMENT */
                check_answer();
                return false;
            }
        });
	$('.question_section').hide();
	$('.check_answer').click(function() {
		check_answer();
	});
});