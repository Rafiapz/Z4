
const dropdown=document.getElementById('reportdropdown')

const ctx = document.getElementById('myChart');

const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: 'Total sales',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  
  options: {
  scales: {
    y: {
      beginAtZero: true,
      
    }
  }
}

});



document.addEventListener("DOMContentLoaded", (tableid)=>{    
    
    $.ajax({
        url:'/admin/salesreport/Day',
        method:'get',
        success:(response)=>{            
            chart.data.datasets[0].data =response.total;
            chart.data.labels=response.labels
            dropdown.innerHTML='Day Wise'
            chart.update()            

        }
    })

})

function updateChart(period) {


  $.ajax({
    url: `/admin/salesReport/${period}`,
    method: 'get',
    success: (response) => {

      chart.data.datasets[0].data =response.total;
      chart.data.labels=response.labels
      dropdown.innerHTML=`${period} Wise`
      chart.update()

    }
  })


}

