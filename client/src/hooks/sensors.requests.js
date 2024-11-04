const API_URL = 'http://localhost:8000';


async function httpGetAllReadouts(){
    const response = await fetch(`${API_URL}/sensors`);
    return await response.json();
}

// nag cconflict sa hardcoded "id" kaya cinomment ko muna
// async function httpGetReadoutById(_id){
//     const response = await fetch(`${API_URL}/sensors/${id}`);
//     return await response.json();
// } 

async function httpGetReadoutsByDate(startDate, endDate){
    const response = await fetch(`${API_URL}/sensors/date/date?startDate=${startDate}&endDate=${endDate}`);
    return await response.json();
}

async function httpGetReadoutsByTime(time){
    const response = await fetch(`${API_URL}/sensors/time/${time}`);
    return await response.json();
}


async function httpNewReadouts(readout){
    try {
        return await fetch(`${API_URL}/sensors`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(readout),
        });
    } catch (err) {
        return {
            ok: false,
        };
    }

    // Send Data Body
    //     "temperature": 6,
    //     "humidity": 33,
    //     "heatIndex": 37,
    //     "lighting": 160,
    //     "headCount": 54,
    //     "oxygen": 24,
    //     "carbonDioxide": 600,
    //     "sulfurDioxide": 30,
    //     "particulateMatter": 15,
    //     "indoorAir": "Good",
    //     "outdoorAir": "Good",
    //     "temp": "Good",
    //     "remarks": "Good"
}


async function httpDeleteReadout(_id){
    try {
        return await fetch(`${API_URL}/sensors/${_id}`, {
            method: "DELETE",
        });
    } catch (err) {
        console.log(err);
        return {
            ok: false,
        };
    }
}
export const readout = [
    {
      id: 1,
  
      readoutID: 1,
      date: '10/16/2024',
      time: '11:59:00 PM',
      temperature: "1",
      humidity: "1",
  
      heatIndex: "1",
      lighting: "1",
      headCount: "1",
      oxygen: "1",
      carbonDioxide: "1",
      sulfurDioxide: "1",
      particulateMatter: "1",
      // set conditions in arduino
      indoorAir: "Good",
      outdoorAir: "Good",
      temp: "Good",
      remarks: "Good",
  
    },
    {
      id: 2,
  
      readoutID: 2,
      date: '10/16/2024',
      time: '11:59:00 PM',
      temperature: "2",
      humidity: "2",
  
      heatIndex: "2",
      lighting: "2",
      headCount: "2",
      oxygen: "2",
      carbonDioxide: "2",
      sulfurDioxide: "2",
      particulateMatter: "2",
      // set conditions in arduino
      indoorAir: "Good",
      outdoorAir: "Good",
      temp: "Good",
      remarks: "Good",
  
    },
    {
      id: 3,
  
      readoutID: 3,
      date: '10/16/2024',
      time: '11:59:00 PM',
      temperature: "3",
      humidity: "3",
  
      heatIndex: "3",
      lighting: "3",
      headCount: "3",
      oxygen: "3",
      carbonDioxide: "3",
      sulfurDioxide: "3",
      particulateMatter: "3",
      // set conditions in arduino
      indoorAir: "Good",
      outdoorAir: "Good",
      temp: "Good",
      remarks: "Good",
  
    },
  ]
async function httpDeleteAllReadouts(){
    try {
        return await fetch(`${API_URL}/sensors`, {
            method: "DELETE",
        });
    } catch (err) {
        console.log(err);
        return {
            ok: false,
        };
    }
}

