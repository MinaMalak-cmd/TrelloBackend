import schedule, { RecurrenceRule } from 'node-schedule';
 
export const croneOne = async() => {
    schedule.scheduleJob('*/1 * * * * *', function(){
        console.log('Crone one running');
    })
}

export const croneTwo = async() => {
    schedule.scheduleJob({minutes: 1, seconds: 3}, function(){
        console.log('Crone two running');
    })
}

export const croneThree = async() => {
    const rule = new RecurrenceRule();
    // rule.hour = 13;
    rule.minute = 27;
    // rule.second = 2;
    // rule.tz= 'Africa/Cairo';
    schedule.scheduleJob(rule, function(){
        console.log('Crone three running');
    })
}