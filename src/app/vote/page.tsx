'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { saveUserId, checkUser } from '@/service/index';
import Style from '@/Style/vote.module.css';
import JavaScript from '@/public/JavaScript.png';
import Java from '@/public/Java.png';
import PHP from '@/public/PHP.png';
import Python from '@/public/Python.png';
import Image from 'next/image';

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [userExists, setUserExists] = useState(false);

    const [, setProfile] = useState<unknown | null>(null);

    useEffect(() => {
        async function initializeLiff() {
            try {
                const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
                if (!liffId) {
                    throw new Error('LIFF ID is not defined.');
                }

                await liff.init({ liffId });

                // ลบการตรวจสอบ isLoggedIn และ login
                const storedUserId = localStorage.getItem('userId');
                let userProfile;

                if (storedUserId) {
                    userProfile = { userId: storedUserId };
                } else {
                    userProfile = await liff.getProfile();
                    localStorage.setItem('userId', userProfile.userId);
                }

                setProfile(userProfile);
                const exists = await checkUser(userProfile.userId);
                setUserExists(exists);

                if (exists) {
                    setError('You have already submitted your choice.');
                }
            } catch (error) {
                console.error('LIFF initialization failed:', error);
            } finally {
                setLoading(false);
            }
        }

        initializeLiff();
    }, []);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOption) {
            alert('Please select an option.');
            return;
        }

        try {
            const profile = await liff.getProfile();

            if (userExists) {
                setError('You have already submitted your choice.');
                return;
            }

            await saveUserId({
                userId: profile.userId,
                selectedOptions: [selectedOption],
            });

            alert('Data submitted successfully!');
            setUserExists(true);
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data.');
        }
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(e.target.value);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={Style.container}>
            <h1 className={Style.title}>Vote</h1>
            <h2 className={Style.title2}>Vote ภาษาที่ตัวเองชอบมากที่สุด</h2>
            {userExists ? (
                <div className={Style.message}>
                    <h3>ขออภัย, คุณได้ทำการโหวตไปแล้ว</h3>
                </div>
            ) : (
                <div className={Style.formcontainer}>
                    <form className={Style.formgroup} onSubmit={handleFormSubmit}>
                        <div className={Style.option}>
                            <input
                                type="radio"
                                id="python"
                                name="language"
                                value="Python"
                                onChange={handleOptionChange}
                                checked={selectedOption === 'Python'}
                            />
                            <label htmlFor="python">
                                <Image src={Python} alt="Python" width={50} height={50} />
                                Python
                            </label>
                        </div>
                        <div className={Style.option}>
                            <input
                                type="radio"
                                id="javascript"
                                name="language"
                                value="Javascript"
                                onChange={handleOptionChange}
                                checked={selectedOption === 'Javascript'}
                            />
                            <label htmlFor="javascript">
                                <Image src={JavaScript} alt="Javascript" width={50} height={50} />
                                Javascript
                            </label>
                        </div>
                        <div className={Style.option}>
                            <input
                                type="radio"
                                id="java"
                                name="language"
                                value="Java"
                                onChange={handleOptionChange}
                                checked={selectedOption === 'Java'}
                            />
                            <label htmlFor="java">
                                <Image src={Java} alt="Java" width={50} height={50} />
                                Java
                            </label>
                        </div>
                        <div className={Style.option}>
                            <input
                                type="radio"
                                id="php"
                                name="language"
                                value="PHP"
                                onChange={handleOptionChange}
                                checked={selectedOption === 'PHP'}
                            />
                            <label htmlFor="php">
                                <Image src={PHP} alt="PHP" width={50} height={50} />
                                PHP
                            </label>
                        </div>
                        <button type="submit" className={Style.buttomS} disabled={!!error}>
                            บันทึก
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
