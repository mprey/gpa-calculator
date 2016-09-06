const STORAGE_KEY = 'gpa-data';

function getGPAFromValue(x, ap) {
  if (x == 1) {
    return 5.0 - (ap ? 0.0 : 1.0);
  } else if (x == 2) {
    return 4.0 - (ap ? 0.0 : 1.0);
  } else if (x == 3) {
    return 3.0 - (ap ? 0.0 : 1.0);
  } else if (x == 4) {
    return 2.0 - (ap ? 0.0 : 1.0);
  }
  return 0.0;
}

function resetTable() {
  if (confirm('Are you sure you want to reset the table?')) {
    $('#table td').parent().remove();
    return true;
  }
  return false;
}

function ne(name, credits, sem1, sem2, checkbox) {
  addRow();
  var row = $('#table tr:last');
  //class name
  if (name) {
    row.find('#className').val(name);
  }

  //credits
  if (credits == 1 || credits == 2) {
    row.find('#credits').val(credits);
  }

  //semester1
  if (sem1 > 0) {
    row.find('#semester1').val(sem1);
  }

  //semester2
  if (sem2 > 0 && credits == 2) {
    row.find('#semester2').val(sem2);
  }

  //ap or pre-ap
  row.find('#checkbox').prop('checked', checkbox);
}

function loadData() {
  if (typeof(Storage) == 'undefined') {
    alert('Your browser does not support local storage.');
    return;
  } else {
    if (resetTable()) {
      if (localStorage.getItem(STORAGE_KEY) !== null) {
        var array = JSON.parse(localStorage.getItem(STORAGE_KEY));
        for (var i = 0; i < array.length; i++) {
          var row = array[i];
          ne(row[0], row[1], row[2], row[3], row[4]);
        }
      } else {
        alert('No saved storage in your browser.');
        return;
      }
    }
  }
}

function saveData() {
  if (typeof(Storage) == 'undefined') {
    alert('Your browser does not support local storage.');
    return;
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getData()));
    alert('Data saved into your browser successfully.');
  }
}

function getData() {
  var data = new Array();
  $('tr:not(".ignore")').each(function() {
    var className = $(this).find('#className').val();
    var credits = $(this).find('#credits').val();
    var semester1 = $(this).find('#semester1').val();
    var semester2 = credits == 2 ? $(this).find('#semester2').val() : null;
    var checkbox = $(this).find('#checkbox').is(':checked');
    data.push(new Array(className, credits, semester1, semester2, checkbox));
  });
  return data;
}

function deleteRow() {
  $('#table tr:last').remove();
}

function addRow() {
  $('#table > tbody').append("<tr>" +
    "<td><input class='form-control' id='className' type='text' placeholder='Class Name (optional)'/></td>" +
    "<td>" +
      "<select id='credits' class='form-control'>" +
      "<option value='0'>Select amount of credits</option>" +
      "<option value='1'>.5 Credit (1 semester)</option>" +
      "<option value='2'>1 Credit (2 semesters)</option>" +
      "</select></td>" +
    "<td>" +
      "<select id='semester1' class='form-control'>" +
      "<option value='0'>Select 1st semester grade</option>" +
      "<option value='1'>A</option>" +
      "<option value='2'>B</option>" +
      "<option value='3'>C</option>" +
      "<option value='4'>D</option>" +
      "<option value='5'>F</option>" +
      "</select></td>" +
    "<td>" +
      "<select id='semester2' class='form-control' disabled>" +
      "<option value='0'>Select 2nd semester grade</option>" +
      "<option value='1'>A</option>" +
      "<option value='2'>B</option>" +
      "<option value='3'>C</option>" +
      "<option value='4'>D</option>" +
      "<option value='5'>F</option>" +
      "</select></td>" +
    "<td><div class='checkbox'><label><input type='checkbox' id='checkbox'> AP/Pre-AP</label></div></td>" +
    "</tr>");
}

function calculate() {
  var totalPoints = 0;
  var totalClasses = 0;
  var error = false;
  $("#table tr:not('.ignore')").each(function() {
    var credits = $(this).find("select#credits").val(),
        semester1 = $(this).find("select#semester1").val(),
        semester2 = $(this).find("select#semester2").val(),
        checkbox = $(this).find("input#checkbox").is(':checked');
    if (credits == 0 || semester1 == 0 || (credits == 2 && semester2 == 0)) {
      alert("Error in the table.");
      error = true;
      return false;
    }
    totalClasses += Number(credits);
    totalPoints += (getGPAFromValue(semester1, checkbox) + (credits == 2 ? getGPAFromValue(semester2, checkbox) : 0.0));
  });
  if (!error) {
    console.log('total points = ' + totalPoints + " total classes = " + totalClasses);
    var gpa = totalPoints / totalClasses;
    alert("Your GPA: " + (Math.round(gpa * 100) / 100));
  }
}

$('#table').on('change', '#credits', function() {
  $(this).parent().parent().find('td:eq(3)').find('select#semester2').prop('disabled', (this.value == 1 ? true : false));
});

addRow();

$('#buttonAdd').click(addRow);
$('#buttonDelete').click(deleteRow);
$('#buttonLoad').click(loadData);
$('#buttonSave').click(saveData);
$('#buttonCalculate').click(calculate);
$('#buttonReset').click(function() {
  if (resetTable()) {
    addRow();
  }
});
