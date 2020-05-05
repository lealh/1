$(function() {
   
    $('a.confirmDeletion').on('click', function(){
        if(!confirm('Confirmed Page deleted!')) return false;
    });
});