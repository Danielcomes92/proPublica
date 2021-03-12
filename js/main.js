data = data.results[0].members;

const select = document.querySelector('#selectStates');
const tbody = document.querySelector('#senate-data')

function insertTable() {
    tbody.innerHTML = '';
    let checkboxGroup = Array.from(document.querySelectorAll('input[name=filterCheck]:checked')).map(el => el.value);
    let stateValue = select.value;
    data.forEach(member => {
        if (checkboxGroup.includes(member.party) && ((stateValue == member.state) || (stateValue == "State"))) {

            const tr = document.createElement('tr');
            
            let tdFullName = document.createElement('td');
            let tdParty = document.createElement('td');
            let tdState = document.createElement('td');
            let tdSeniority = document.createElement('td');
            let tdVotesWithParty = document.createElement('td');
            
            tdFullName.innerHTML = `<a href="${member.url}" target="_blank"> ${member.first_name} ${member.last_name} </a>`;
            tdParty.textContent = `${member.party}`;
            tdState.textContent = `${member.state}`;
            tdSeniority.textContent = `${member.seniority}`;
            tdVotesWithParty.textContent = `${member.votes_with_party_pct || 0}`;
            
            tr.appendChild(tdFullName)
            tr.appendChild(tdParty)
            tr.appendChild(tdState)
            tr.appendChild(tdSeniority)
            tr.appendChild(tdVotesWithParty)
    
            tbody.appendChild(tr);
        }       
    });
}
insertTable();

let statesAux = [];
data.forEach(stateMember => {
    if(statesAux.indexOf(stateMember.state) == -1) {
        statesAux.push(stateMember.state)
    }
});

statesAux.sort();
statesAux.forEach(state => {
    option = document.createElement('option');
    option.value = state;
    option.text = state;
    select.appendChild(option)
});


