import React, { useState, useEffect } from 'react';
import { getStreak } from '../services/taskApi';
import '../styles/StreakBanner.css';

// The 31 Motivational Quotes Array
const QUOTES = [
    "The deed dearest to Allah Ta'ala is that which is most consistent, even if it is small.",
    "Gladly except Allah Ta'ala's will and you will [truly] becomes Zaahid.",
    "The Bane of Ibaadat is listlessness.",
    "The Bane of knowledge is to forget.",
    "Planning is one half of life.",
    "Du'aa' is a mumin's weapon.",
    "Seeking knowledge is obligatory upon every Muslim man and woman.",
    "Al Quran itself is the cure and Du'aa' itself is 'Ibaadat'.",
    "A mumin is like a honey bee: it does not consume nor give except that which is pure and Wholesale.",
    "Speak al-Haq (what is true and right) even though it may be bitter.",
    "Allah Ta'ala takes responsibility for the livelihood of one who seeks knowledge.",
    "Patients is the grave of all flaws.",
    "Ward off the waves of hardship with Du'aa.",
    "Only through ikhlaas is salvation attainable.",
    "The hearts cure is the recitation of Al-Quran.",
    "You are obliged to make an effort, but you are not obliged to succeed.",
    "Each man's worth is [determined by] what he does well.",
    "There is no knowledge like [knowledge gained through] contemplation.",
    "He who perseveres patiently will not be deprived of success, no matter how long it takes.",
    "Continuous longing and unrealistic expectations spoils one's endeavours.",
    "He who is mindful of the journey's distance prepares [for it].",
    "An ungrateful person will not achieve success.",
    "Asking a worthy question is one-half of knowledge.",
    "A word of wisdom is every wise men's lost object.",
    "The best of all things is having faith in Allah Ta'ala.",
    "I saw Supremacy and found it in seeking knowledge and in taqwaa.",
    "A man's hardship is a prelude to prosperity.",
    "Recalling experience is an element of toufeeq.",
    "No two things have been better combined then the combination of forbearance with knowledge.",
    "Three things prevent forgetfulness and sharpen the memory: 1) reciting Al Quran, 2) brushing one's teeth, 3) observing Rozah.",
    "Taufeeq always accompanies good intent.",
    "When anything is sought through its correct channel it is easily obtained. Anyone who attempts otherwise, however, will stray from the right path, stumble and fall.",
    "When, for the sake of Allah Ta'ala, a man applies what knowledge he posses Allah Ta'ala will enlighten him with knowledge he does not possess.",
    "Awaiting relief from suffering through patients is 'Ibaadat'.",
    "The finest amongst you is he who Learns and teaches Al-Quran Al-Majid.",
    "Facilitate, do not Hinder.",
    "Beware of negligence for it robs you of blessing.",
    "Indeed, the completion of faith lies in seeking knowledge and acting in accordance with it.",
    "Always we content with water faith decrease.",
    "When situation becomes bitter let your patience be sweet.",
    "My brother, know that man's most praise worthy virtue is intellect and his greatest quality is learnedness.",
    "Knowledge is of no benefit unless it is applied and deeds are of no use unless they are accepted.",
    "Stay away from fearfulness, listlessness stubbornness and quarrelsomeness."
];

const StreakBanner = () => {
    const [streak, setStreak] = useState(0);
    const [dailyQuote, setDailyQuote] = useState("");

    useEffect(() => {
        // Load streak from database
        getStreak().then(res => {
            if(res.success) setStreak(res.data.streak);
        });

        // INFINITE LOOP LOGIC: Calculate "Day of the Year" and use modulo math
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        // Divide by 31 (number of quotes) to get the index for today
        const quoteIndex = dayOfYear % QUOTES.length;
        setDailyQuote(QUOTES[quoteIndex]);
    }, []);

    return (
        <div className="streak-banner">
            <div className="streak-info">
                <div className="streak-fire">🔥</div>
                <div>
                    <h2>{streak} Days Consistent!</h2>
                    <p>Keep up the amazing work.</p>
                </div>
            </div>
            <div className="daily-quote">
                <p>"{dailyQuote}"</p>
            </div>
        </div>
    );
};

export default StreakBanner;