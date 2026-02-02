/**
 * data.js
 * Comprehensive database of Mount Abu destinations and Treks.
 */

// ==========================================
// 1. MAIN DESTINATIONS (Top, Gems, Functional)
//    *Excludes Eco-Tourism/Treks*
// ==========================================

export const destinations = [
    // --- A. TOP DESTINATIONS ---
    {
        id: "top-gaumukh",
        slug: "gaumukh-guru-vasisth-ashram",
        title: "Gaumukh / Guru Vasisth Ashram",
        description:
            "A stream of constantly flowing natural water through a cow's face statue, associated with ancient sages.",
        details: {
            heading: "Ancient Ashram & Mythological Site",
            text: "One of the well-known locations of Abu is the Gaumukh temple. It is a stream of constantly flowing natural water, through the Statue of a cow's face. Once only popular for ancient sages and saints to meditate at. It is located around 5 kilometers from the Hanuman Temple situated in a wild valley that is reached by descending about 700 steps. Other than its location, what makes this place more intriguing is the story associated with it. Mount Abu has been home to many legends across the time line of our ancient history. One of them is Guru Vashishta. It has been described in Mahabharata that Lord Rama and Lakshman came here to Vashisth Ashram to study. One mythological tale related to Guru Vashishta is said to be the reason behind the creation of the Gaumukh temple and is also the story that formed the grounds for the formation of Mount Abu. Once Guru Vashistha's cow Nandi fell into a gorge and was trapped there. Feeling helpless by the atrocity, the sage prayed to Lord Shiva for help. The Lord helped him by sending Goddess Saraswati in the form of a stream to help the cow become free of the gorge. Finally, Nandi was rescued and the location was named 'Gaumukh' because a stream of water has continued to flow out of it ever since and still hasn't stopped.",
            images: {
                main: "/images/destination/Gaumukh- Guru Vasisth Ashram/img_1.jpg",
                gallery: [
                    "/images/destination/Gaumukh- Guru Vasisth Ashram/img_2.jpg",
                    "/images/destination/Gaumukh- Guru Vasisth Ashram/img_3.jpg",
                    "/images/destination/Gaumukh- Guru Vasisth Ashram/img_4.jpg",
                    "/images/destination/Gaumukh- Guru Vasisth Ashram/img_5.png",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Located around 5 kilometers from the Hanuman Temple.",
                "Requires descending about 700 steps.",
                "Situated in a wild valley.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-adhar-devi",
        slug: "arbuda-adhar-devi-temple",
        title: "Arbuda (Adhar) Devi Temple",
        description:
            "An ancient 5500-year-old temple dedicated to Goddess Durga, located inside a cave.",
        details: {
            heading: "Cave Temple of the Tutelary Goddess",
            text: "The Adhar Devi Temple is an ancient 5500 years old temple dedicated to the Hindu Goddess Durga. This temple is mentioned in the Skanda Purana as well as other holy books. A later inscription from 1575CE notes the donation of a temple gateway with intricate carvings. It is one of the well-known religious sites in Mount Abu, located three kilometres north of the main town. The Adhar Dev temple is also known as Arbuda Devi temple. The temple is reached by going up 365 steps carved into the mountain. An alternative path to the temple begins at the old well close to Limdi Kothi and Bikaner House, which comes under wildlife corridor. A little cave inside a noticeable rock formation houses the picture of Adhar Devi, the tutelary goddess of Abu. Arbuda Devi temple belongs to that period when the idols were placed in caves.",
            images: {
                main: "/images/destination/arbuda-(adhar)-devi-temple/mian.jpg",
                gallery: [
                    "/images/destination/arbuda-(adhar)-devi-temple/image_1.jpg",
                    "/images/destination/arbuda-(adhar)-devi-temple/image_3.jpg",
                    "/images/destination/arbuda-(adhar)-devi-temple/image_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Reached by going up 365 steps carved into the mountain.",
                "Alternative path exists via Limdi Kothi (wildlife corridor).",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-achalgarh",
        slug: "achalgarh-fort-and-temple",
        title: "Achalgarh Fort And Temple",
        description:
            "A 15th-century fort housing the Acheleshwar Mahadev Temple where Lord Shiva's thumb is worshipped.",
        details: {
            heading: "Historical Fort & Unique Shiva Temple",
            text: "About 11 kilometres to the north of Mount Abu's city centre is the fort of Achalgrah. One of the 32 forts built under Maharana Kumbha's authority, the fort was initially established by the Pramara Dynasty kings and afterwards rebuilt, repaired, and given the name Achalgrah. The Acheleshwar Mahadev Temple, located in the fort, still contains god statues crafted of crystal quartz (Sphatik) by Maharana Kumbha. Acheleshwar Mahadev Temple is situated near the entrance of the fort. In contrast to other temples where Shivlings are worshipped, this temple is the only one in the world where people worship Lord Shiva's left thumb. On the steep slope of the top fort region sits the Chaumukh Temple, a Jain temple devoted to Lord Adinath.",
            images: {
                main: "/images/destination/achalgrah-fort-and-temple/main.jpg",
                gallery: [
                    "/images/destination/achalgrah-fort-and-temple/image_1.jpg",
                    "/images/destination/achalgrah-fort-and-temple/image_2.jpg",
                    "/images/destination/achalgrah-fort-and-temple/image_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Located 11km north of city center.",
                "Contains the only temple where Shiva's left thumb is worshipped.",
                "Features the Chaumukh Jain temple on the steep slope.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-dilwara",
        slug: "delwara-jain-temple",
        title: "Delwara Jain Temple",
        description:
            "World-famous collection of Jain temples known for their exquisite marble carvings.",
        details: {
            heading: "Architectural Marvel of Jainism",
            text: "The Delwara Temples are a collection of 'Shvtmbara Jain' temples situated in Mount Abu, some 2.5 kilometres from the Mount Abu town. The earliest were allegedly created or at least funded by Vastupala. Key temples include: Shri Mahaveer Swami Temple (constructed 1582), Shri Adinath Temple or Vimal Vasahi Temple (oldest, built 1031 A.D. by Vimal Shah), Shri Parshavnath Temple or Khartar Vasahi Temple (tallest shrine, built 1458-59 A.D.), Shri Rishabdaoji Temple or Peethalhar Temple (known for brass statues), and Shri Nemi Nath Ji Temple or Luna Vasahi Temple (built 1230 A.D. by Tejpal and Vastupal).",
            images: {
                main: "/images/destination/delwara-jain-temple/main.jpg",
                gallery: [
                    "/images/destination/delwara-jain-temple/image_1.jpg",
                    "/images/destination/delwara-jain-temple/image_2.jpg",
                    "/images/destination/delwara-jain-temple/image_3.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Free",
            timings:
                "Generally open morning and afternoon hours (varies seasonally)",
            photography: "Photography not allowed inside temples",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Modest dress required.",
                "Located approx 2.5 km from town.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-raghunathji",
        slug: "raghunathji-temple",
        title: "Raghunathji Temple",
        description:
            "A 14th-century temple on the banks of Nakki Lake dedicated to Lord Vishnu's reincarnation.",
        details: {
            heading: "Pilgrimage Site on Nakki Lake",
            text: "The 14th-century Raghunathji temple, a popular pilgrimage site, is situated at the south western bank of Nakki Lake. According to legend, Shri Ramanand constructed it. Raghunathji temple was established by the Guru of Kabir and visited by Guru Nanak. The temple is dedicated to Shri Raghunathji, who is believed to be Lord Vishnu's reincarnation. Located on the shores of Nakki Lake, this temple is 650 years old. Swami Dayanand, founder of Arya Samaj, is believed to have meditated in Rama cave of these during 1852-54.",
            images: {
                main: "/images/destination/raghunathji-temple-dharam-shala/img 4.jpg",
                gallery: [
                    "/images/destination/raghunathji-temple-dharam-shala/img 1.png",
                    "/images/destination/raghunathji-temple-dharam-shala/img 2.png",
                    "/images/destination/raghunathji-temple-dharam-shala/img 3.png",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Situated at the south western bank of Nakki Lake.",
                "Includes Ram Jarokha, Champa Cave, and Hasti Cave.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-duleshwar",
        slug: "duleshwar-mahadev-temple",
        title: "Duleshwar Mahadev Temple",
        description:
            "A 450-year-old Shiva temple next to Nakki Lake with a legend involving a hunter and a deer.",
        details: {
            heading: "The Legend of Gurudroh",
            text: "Shiv temple Duleshwar Mahadev Temple is thought to be about 450 years old. The legend surrounding the construction of this temple next to Nakki Lake involves a hunter named Gurudroh who was waiting for prey on a bilva tree. Through a series of events involving a deer and his unknowing offering of bilva leaves and water to a Shivaling below, he performed Shiva Pooja. Lord Shiva appeared to bless him, naming the Shivaling 'Druhishwar' (now Duleshwar) Mahadev. This story is written in Shiv Puran.",
            images: {
                main: "/images/destination/Duleshwar Mahadev Temple/img_1.jpg",
                gallery: [
                    "/images/destination/Duleshwar Mahadev Temple/img_2.jpg",
                    "/images/destination/Duleshwar Mahadev Temple/img_3.jpg",
                    "/images/destination/Duleshwar Mahadev Temple/img_4.png",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Located next to Nakki Lake."],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-guru-shikhar",
        slug: "guru-shikhar",
        title: "Guru Shikhar",
        description:
            "The highest peak of the Aravalli Range, housing the temple of Dattatreya.",
        details: {
            heading: "Highest Peak of Aravalli",
            text: "The highest peak of the Aravalli mountain range is Guru Shikhar on Mount Abu at 1,722 m (5,650 ft). It is located 15 Km away from mount Abu’s city center. The temple of Dattatreya is one of the main attractions at Guru Shikhar peak. Lord Dattatreya is believed to be an incarnation of Lord Vishnu. It is believed that the lord actually put his foot on this peak sanctifying the place. Inside the natural cave is Akhand Dhuni (eternal holy flame) performed by Dattatreya himself burning for 24 hours.",
            images: {
                main: "/images/destination/guru-sikhar/main.jpg",
                gallery: [
                    "/images/destination/guru-sikhar/image_1.jpg",
                    "/images/destination/guru-sikhar/image_3.jpg",
                    "/images/destination/guru-sikhar/image_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Daily early morning havan at 4am",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Highest point in Rajasthan.",
                "Contains footprint marks of the Lord in rocky caves.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-nakki-lake",
        slug: "nakki-lake",
        title: "Nakki Lake",
        description:
            "The first man-made lake in India, steeped in legends of gods and love stories.",
        details: {
            heading: "Heart of Mount Abu",
            text: "Nakki lake is the first man-made lake in India. It is about half a mile long and 20-30 feet deep. The first legend is that the lake was built by Gods (using nails, hence 'Nakki') to protect people from the Bashkali demon. Another tale involves sage Rasiya Balam who dug the lake with his fingernails to win the hand of a princess, though the love story ended in tragedy due to the princess's mother. It is also the site where Mahatma Gandhi's ashes were immersed in 1948 (Gandhi Ghat).",
            images: {
                main: "/images/destination/nakki-lake/image_1.jpg",
                gallery: [
                    "/images/destination/nakki-lake/image_2.jpg",
                    "/images/destination/nakki-lake/image_3.jpg",
                    "/images/destination/nakki-lake/image_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Boating is a popular activity here.",
                "Surrounded by markets and hotels.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-sunset-point",
        slug: "sunset-point",
        title: "Sunset Point",
        description:
            "A picturesque point offering stunning views of the setting sun over the Aravali hills.",
        details: {
            heading: "Scenic Viewpoint",
            text: "Sunset Point is one of Mount Abu's most well-known locations, situated to the southwest of Nakki Lake. This picturesque point offers stunning views of the Aravali hills and is best viewed around sunset. An ineffably spectacular view of the setting sun like a sinking fireball fills the onlookers with joy. The point is the edge of the hill with steep hundreds of feet down to distant valleys.",
            images: {
                main: "/images/destination/sunset-point/image_1.jpg",
                gallery: [
                    "/images/destination/sunset-point/image_2.jpg",
                    "/images/destination/sunset-point/image_3.jpg",
                    "/images/destination/sunset-point/image_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Best viewed around sunset",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Situated southwest of Nakki Lake.",
                "Bordered by food vendors and gift shops.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "top-trevors-tank",
        slug: "trevors-tank",
        title: "Trevor's Tank",
        description:
            "A man-made crocodile breeding site and wildlife sanctuary created by a British engineer.",
        details: {
            heading: "Eco-Tourism & Crocodile Park",
            text: "Trevor's Tank is a sizable artificial lake located on Gurushikhar road. Created in 1897 AD by Col. G.H. Trevor, this location serves as a crocodile breeding ground. The area was gifted by Maharao Kesari Singhji Bahadur of Sirohi. It is a haven for birdwatchers and home to pigeons, peacocks, and partridges. Wild Black Bears are also a major attraction.",
            images: {
                main: "/images/destination/travor_s-tank/img_1.jpg",
                gallery: [
                    "/images/destination/travor_s-tank/img_2.jpg",
                    "/images/destination/travor_s-tank/img_3.jpg",
                    "/images/destination/travor_s-tank/img_4.jpg",
                    "/images/destination/travor_s-tank/img_5.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Salim Ali bird watching tower is located at the back.",
                "Located on Gurushikhar road.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },

    // --- B. UNEXPLORED GEMS ---
    {
        id: "gem-agni-kund",
        slug: "agni-kund-at-gaumukh",
        title: "Agni Kund at Gaumukh",
        description:
            "A historical fire pit believed to be the origin of four main Agnikul Rajput clans.",
        details: {
            heading: "Origin of Rajput Clans",
            text: "According to Chand Birdai's 'Prithviraj Rasho', the four main Agnikul Rajput clans—the Chalukyas, Pratihars, Chauhans, and Parmars—were descended from this Kund. The place Agni Kund means a fire pit. Nearby ancient places include Vyas tirth, Nag Tirtha, and Gautam Ashram.",
            images: {
                main: "/images/destination/Agni Kund at Gaumukh/Img_1.png",
                gallery: [],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Near Vashishtha Ashram."],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "gem-suraj-kund",
        slug: "suraj-kund",
        title: "Suraj Kund",
        description:
            "A water-filled crater where the water appears golden at sunrise.",
        details: {
            heading: "The Golden Water Kund",
            text: "Suraj Kund is next to the Tiger Path. It features a large rock with a deep crater filled with water that never dries up. It is the only open area in the dense forest around. As the sun rises, sun rays make the kund appear to be filled with golden water, hence the name.",
            images: {
                main: "/images/destination/suraj-kund/img_1.jpg",
                gallery: [
                    "/images/destination/suraj-kund/img-2.jpg",
                    "/images/destination/suraj-kund/img_3.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Best at sunrise",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Located next to the Tiger Path.",
                "Connected to Lord Shiva.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "gem-chandra-kund",
        slug: "chandra-kund",
        title: "Chandra Kund",
        description:
            "A natural water body where the moon's reflection is perfectly centered on full moon nights.",
        details: {
            heading: "The Moon Reflection Kund",
            text: "Chandra Kund is situated on Baily's walk's ascending slope, behind Nakki lake. Similar to Suraj kund, it features a Shivling and a small ancient temple. Water regularly drips onto the Shivling. At the exact centre of this kund, one may see the moon's direct reflection in the water on the day of a full moon.",
            images: {
                main: "/images/destination/chandra-kund/main.jpg",
                gallery: ["/images/destination/chandra-kund/images_1.jpg"],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Best on Full Moon nights",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Located on Baily's walk ascending slope.",
                "Pitch-black forest surroundings at night.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "gem-kaner-kund",
        slug: "kaner-kund",
        title: "Kaner Kund",
        description:
            "A historical kund surrounded by Kaner flowers, used by tribal people for rituals.",
        details: {
            heading: "Tribal Ritual Site",
            text: "Mid way of Baily's trek is where Kaner Kund is situated. Named after the 'Kaner' (Oleander) flowers that abound here. This kund is linked to the ancient Garasia tribal people who used to perform rituals here before hunting and bathe here upon return.",
            images: {
                main: "/images/destination/Kaner Kund/img_1.png",
                gallery: [],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Located midway on Baily's trek."],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "gem-dudh-bavadi",
        slug: "dudh-bavadi",
        title: "Dudh Bavadi",
        description: "A small step well known for its milky-colored water.",
        details: {
            heading: "The Milk Step Well",
            text: "The primary pilgrim access to the Adhar Devi temple is near Dudh Bavadi. Likely built in the 16th century. Named 'Dudh' (Milk) Bavadi due to the water’s milky colour and sweetness. One must descend a short, steep flight of steps to reach it. Currently, the water is polluted.",
            images: {
                main: "/images/destination/Dudh Bavadi/img_1.png",
                gallery: [],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: [
                "Near Adhar Devi temple.",
                "Ancient building in poor condition.",
            ],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "gem-moors-cave",
        slug: "moors-cave",
        title: "Moor’s Cave",
        description:
            "A hidden cave containing inscriptions by the missing British Officer Arthur Thomas Moore.",
        details: {
            heading: "Historical Mystery",
            text: "Major General Arthur Thomas Moore was a British officer awarded a Victoria Cross. He went missing for 3-4 years in India. In 2006, Dr. Sharma discovered this cave near Sunset Point with inscriptions in Moore's handwriting dating to 1901, proving he visited Mount Abu during his disappearance.",
            images: {
                main: "/images/destination/moor’s-cave/image_1.jpg",
                gallery: [
                    "/images/destination/moor’s-cave/image_2.jpg",
                    "/images/destination/moor’s-cave/image_3.jpg",
                    "/images/destination/moor’s-cave/image_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Located near Sunset Point."],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "gem-mogli-land",
        slug: "mogli-land",
        title: "Mogli Land",
        description:
            "An area with ancient civilization remnants resembling the forest from The Jungle Book.",
        details: {
            heading: "Ancient Ruins & Forest",
            text: "Ancient civilization remnants, including bricks and pots over 1000 years old, were discovered around 800 meters above Aarana Village. The location is being developed as 'Mogli Land' due to its similarities to the forest in Rudyard Kipling's The Jungle Book.",
            images: {
                main: "/images/destination/mogli-land/main.jpg",
                gallery: [],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Located above Aarana Village."],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },

    // --- D. FUNCTIONAL CATEGORIES (Viewpoints, Heritage, Markets, Wildlife) ---
    {
        id: "view-toad-rock",
        slug: "toad-rock",
        title: "Toad Rock",
        description:
            "A massive rock formation resembling a toad jumping into the water.",
        details: {
            heading: "Iconic Rock Formation",
            text: "Abu is well-known for its numerous rock formations, with Toad Rock being one of the most well-known close to Nakki Lake. The igneous rock is estimated to be six billion years old. Suitable for rock climbing and trekking.",
            images: {
                main: "/images/destination/toad-rock/image_1.jpg",
                gallery: [
                    "/images/destination/toad-rock/image_2.jpg",
                    "/images/destination/toad-rock/image_3.jpg",
                    "/images/destination/toad-rock/image_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Free",
            timings: "Not stated",
            photography: "Allowed",
            ageLimit: "All Ages",
            quietHours: "Not enforced",
            smoking: "Not allowed",
            pets: "Not allowed",
            notes: ["Near Nakki Lake"],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "view-nun-rock",
        slug: "nun-rock",
        title: "Nun Rock",
        description:
            "A rock simulating a veiled nun, though damaged by lightning in 1994.",
        details: {
            heading: "Natural Rock Formation",
            text: "12 ft. high near the tennis court of Rajputana club. Resembles a veiled nun with hands folded in prayer. Split in half by lightning in 1994, altering its shape.",
            images: {
                main: "/images/destination/nun-rock/image_1.jpg",
                gallery: [
                    "/images/destination/nun-rock/image_2.jpg",
                    "/images/destination/nun-rock/image_3.jpg",
                    "/images/destination/nun-rock/image_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Near Rajputana Club"],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "wild-sanctuary",
        slug: "mount-abu-wildlife-sanctuary",
        title: "Mount Abu Wildlife Sanctuary",
        description:
            "A rich biodiversity hotspot in the Aravalli range home to leopards and sloth bears.",
        details: {
            heading: "Oldest Mountain Range Sanctuary",
            text: "Located in the Aravalli range. Declared a sanctuary in 1980. Spreads out into a plateau about 19km long and 6km wide. Home to 820 species of plants, and animals like Indian Leopard, Sloth Bear, Sambar, and the uncommon Green Munia bird.",
            images: {
                main: "/images/destination/mount-abu-wildlife-sanctuary/main.jpeg",
                gallery: [
                    "/images/destination/mount-abu-wildlife-sanctuary/image_2.jpg",
                    "/images/destination/mount-abu-wildlife-sanctuary/image_3.jpg",
                    "/images/destination/mount-abu-wildlife-sanctuary/image_4.jpg",
                    "/images/destination/mount-abu-wildlife-sanctuary/image_1.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Allowed",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Eco-sensitive zone."],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "her-kesar-bhavan",
        slug: "kesar-bhavan-palace",
        title: "Kesar Bhavan Palace",
        description:
            "An eco-friendly heritage hotel built in 1870 by Maharaj Daivat Singh of Sirohi.",
        details: {
            heading: "Royal Heritage",
            text: "Built in the late 1870s and belonging to Maharaj Daivat Singh of Sirohi. Converted into the first eco-friendly heritage hotel of Abu in 1997. Perched atop a hillock with panoramic views.",
            images: {
                main: "/images/destination/Kesar Bhavan Palace/img_1.jpg",
                gallery: [
                    "/images/destination/Kesar Bhavan Palace/img_2.jpg",
                    "/images/destination/Kesar Bhavan Palace/img_3.jpg",
                    "/images/destination/Kesar Bhavan Palace/img_4.jpg",
                    "/images/destination/Kesar Bhavan Palace/img_5.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Heritage Hotel"],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "her-swarup-bhavan",
        slug: "swarup-bhavan-palace",
        title: "Swarup Bhavan Palace",
        description:
            "A 1907 palace blending Roman, Rajput, Moorish, and Gothic styles, currently the summer home of the Sirohi Royal Family.",
        details: {
            heading: "Architectural Marvel",
            text: "Built in 1907 A.D. by Maharao Keshri Singh of Sirohi, this palace is a unique amalgamation of four architectural styles: a Roman porch, Rajput jharokhas, Moorish arches, and a Gothic central corridor. During the World Wars, it served as a convalescence home for allied forces. Today, it remains the private summer residence of the Sirohi Royal Family.",
            images: {
                main: "/images/destination/Swarup Bhavan Palace/img_1.jpeg",
                gallery: [
                    "/images/destination/Swarup Bhavan Palace/img_2.jpeg",
                    "/images/destination/Swarup Bhavan Palace/img_3.jpeg",
                    "/images/destination/Swarup Bhavan Palace/img_4.jpeg",
                    "/images/destination/Swarup Bhavan Palace/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Private Residence", "Summer Home"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-bikaner-palace",
        slug: "bikaner-palace",
        title: "Bikaner Palace",
        description:
            "Designed by Sir Swinton Jacob in 1893, this estate-like palace is now a heritage hotel surrounded by peaceful hills.",
        details: {
            heading: "The Palace Hotel",
            text: "Constructed in 1893 for Maharaja Ganga Singh and designed by the renowned Sir Samuel Swinton Jacob, Bikaner House is a landmark example of colonial-era architecture in Rajasthan. Converted into a hotel in 1962, the property preserves an old-world layout with extensive grounds and natural rock formations, offering a quiet, estate-like atmosphere distinct from newer resorts.",
            images: {
                main: "/images/destination/Bikaner Palace/img_1.jpeg",
                gallery: [
                    "/images/destination/Bikaner Palace/img_2.jpeg",
                    "/images/destination/Bikaner Palace/img_3.jpeg",
                    "/images/destination/Bikaner Palace/img_4.jpeg",
                    "/images/destination/Bikaner Palace/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Heritage Hotel", "Large Grounds"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-jaipur-house",
        slug: "jaipur-house",
        title: "Jaipur House",
        description:
            "A late-19th-century royal retreat perched on a cliff overlooking Nakki Lake, featuring traditional Rajput architecture.",
        details: {
            heading: "Cliffside Royal Retreat",
            text: "Built in 1897 by Maharaja Sawai Ram Singh II, Jaipur House is perched on a mountaintop next to Nakki Lake, offering some of the best panoramic views in Mount Abu. The palace features classic Rajput elements like 'Chatris' and 'Jharokhas.' Now a boutique heritage hotel, it combines the original palace structure with modern comforts, including suites named after the seasons of Rajasthan.",
            images: {
                main: "/images/destination/Jaipur House/img_1.jpeg",
                gallery: [
                    "/images/destination/Jaipur House/img_2.jpeg",
                    "/images/destination/Jaipur House/img_3.jpeg",
                    "/images/destination/Jaipur House/img_4.jpeg",
                    "/images/destination/Jaipur House/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Heritage Hotel", "Lake View"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-alwar-house",
        slug: "alwar-house",
        title: "Alwar House",
        description:
            "A grand structure resembling a French chateau with Gothic towers, currently operating as a residential school.",
        details: {
            heading: "Architectural Showpiece",
            text: "Known today as the Adarsh Vidya Mandir Shankar Vidya Peeth, Alwar House was built by the King of Alwar to rival other royal residences. The design is distinct from typical Rajput silhouettes, featuring steep red roofs and Gothic-style towers reminiscent of a French chateau. Since 1995, this heritage site has functioned as an educational campus rather than a hotel.",
            images: {
                main: "/images/destination/Alwar House/img_1.jpeg",
                gallery: [
                    "/images/destination/Alwar House/img_2.jpeg",
                    "/images/destination/Alwar House/img_3.jpeg",
                    "/images/destination/Alwar House/img_4.jpeg",
                    "/images/destination/Alwar House/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Restricted (School Campus)",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Educational Institution", "Not a Hotel"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-palanpur-house",
        slug: "palanpur-house",
        title: "Palanpur House",
        description:
            "A century-old palace turned hotel, originally built by the Nawab of Palanpur and known for its old-world charm.",
        details: {
            heading: "Historic Hospitality",
            text: "Constructed more than a century ago by Nawab Sher Mohammed Khan, this property was later modified by his son into a summer castle. It has a long history of hospitality, operating first as 'Mount Hotel,' then 'Hotel Skeltania,' and now as Palanpur Palace. It is recognized for its large rooms and quiet, lush surroundings typical of early hill-station estates.",
            images: {
                main: "/images/destination/Palanpur House/img_1.jpeg",
                gallery: [
                    "/images/destination/Palanpur House/img_2.jpeg",
                    "/images/destination/Palanpur House/img_3.jpeg",
                    "/images/destination/Palanpur House/img_4.jpeg",
                    "/images/destination/Palanpur House/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Heritage Hotel"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-cama-rajputana",
        slug: "cama-rajputana-club",
        title: "Cama Rajputana Club",
        description:
            "A 135-year-old British-era club restored into a heritage resort with extensive gardens and sporting history.",
        details: {
            heading: "Colonial Leisure",
            text: "Established over 135 years ago, the Cama Rajputana Club was once the center of social activity for British officers and Rajputana Maharajas. Today, it is a heritage resort spread across approximately 18 acres of landscaped grounds, featuring fountains and waterfalls. It retains its legacy as a leisure destination, preserving the history of its ballrooms and sports tournaments.",
            images: {
                main: "/images/destination/Cama Rajputana Club/img_1.jpeg",
                gallery: [
                    "/images/destination/Cama Rajputana Club/img_2.jpeg",
                    "/images/destination/Cama Rajputana Club/img_3.jpeg",
                    "/images/destination/Cama Rajputana Club/img_4.jpeg",
                    "/images/destination/Cama Rajputana Club/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Heritage Resort", "Colonial History"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-kishangarh-house",
        slug: "kishangarh-house",
        title: "Kishangarh House",
        description:
            "A late-colonial Victorian estate built in the 1890s, surrounded by large gardens.",
        details: {
            heading: "Victorian Retreat",
            text: "Originally known as Victoria House, this property was built around 1890 as a royal retreat for the Maharaja of Kishangarh. It is a prime example of the Victorian style of architecture in Mount Abu. The house sits within a 5-acre estate featuring Silver Birch and Mango trees, operating today as a heritage stay that balances proximity to the town center with natural seclusion.",
            images: {
                main: "/images/destination/Kishangrah House/img_1.jpeg",
                gallery: [
                    "/images/destination/Kishangrah House/img_2.jpeg",
                    "/images/destination/Kishangrah House/img_3.jpeg",
                    "/images/destination/Kishangrah House/img_4.jpeg",
                    "/images/destination/Kishangrah House/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Heritage Hotel", "Victorian Architecture"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-limdi-palace",
        slug: "limdi-palace",
        title: "Limdi Palace",
        description:
            "An immense colonial-era structure that remains one of the largest, yet partially unfinished, royal projects in Mount Abu.",
        details: {
            heading: "The Unfinished Masterpiece",
            text: "Commissioned by His Highness Daulat Singh Ji of Limdi, this palace was intended to be one of the largest in Mount Abu. However, the project was never fully completed after the ruler's passing. The existing structure, originally meant for officers and staff, still boasts a massive footprint. It has seen various uses, including as a school, and is currently undergoing renovation for hospitality purposes.",
            images: {
                main: "/images/destination/Limdi Palace/img_1.jpeg",
                gallery: [
                    "/images/destination/Limdi Palace/img_2.jpeg",
                    "/images/destination/Limdi Palace/img_3.jpeg",
                    "/images/destination/Limdi Palace/img_4.jpeg",
                    "/images/destination/Limdi Palace/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Under Renovation", "Historical Building"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-connaught-house",
        slug: "connaught-house",
        title: "Connaught House",
        description:
            "A 1930s English cottage-style heritage property, originally the residence of Jodhpur's last British Chief Minister.",
        details: {
            heading: "English Country Charm",
            text: "Built in the 1930s by Sir Donald Field, the last British Chief Minister of Jodhpur, Connaught House is a heritage hotel that resembles a traditional English cottage. It is now part of the Jodhpur royal family's properties. Tucked away in a quiet area near Nakki Lake, it functions like a country manor, offering a calm, garden-set retreat distinct from larger hotels.",
            images: {
                main: "/images/destination/Connaught House/img_1.jpeg",
                gallery: [
                    "/images/destination/Connaught House/img_2.jpeg",
                    "/images/destination/Connaught House/img_3.jpeg",
                    "/images/destination/Connaught House/img_4.jpeg",
                    "/images/destination/Connaught House/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Heritage Hotel", "Cottage Style"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-altus-house",
        slug: "altus-house",
        title: "Altus House",
        description:
            "An opulent Indo-western guest house perched on a hill, formerly a royal abode.",
        details: {
            heading: "Hilltop Luxury",
            text: "Altus House is a luxury guest house situated on the outskirts of Mount Abu, perched atop a small hill with rock formations and trees. Formerly an exclusive abode of the Rajputana Royal family, the property has been refurbished to offer modern comforts while retaining its heritage atmosphere. It features terraced lawns and panoramic views of the natural surroundings.",
            images: {
                main: "/images/destination/altus-house/main.jpg",
                gallery: [
                    "/images/destination/altus-house/img_2.jpeg",
                    "/images/destination/altus-house/img_3.jpeg",
                    "/images/destination/altus-house/img_4.jpeg",
                    "/images/destination/altus-house/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Luxury Homestay", "Heritage"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-wordsworth-lodge",
        slug: "wordsworth-lodge",
        title: "Wordsworth Lodge",
        description:
            "A boutique stay with a unique literary connection, built in the 1960s on the slopes of Gurushikhar.",
        details: {
            heading: "A Literary Legacy",
            text: "This charming boutique hotel has a unique origin story: it was built in the 1960s by Diana Wordsworth, a descendant of poet William Wordsworth, and Colonel Buddha Sen. The site was selected with the help of famous tiger conservationist Fateh Singh Rathore. Designed by architect Rumy Shroff to blend with the topography, it offers a secluded stay on the forested slopes of Gurushikhar.",
            images: {
                main: "/images/destination/Wordsworth Lodge/img_1.jpeg",
                gallery: [
                    "/images/destination/Wordsworth Lodge/img_2.jpeg",
                    "/images/destination/Wordsworth Lodge/img_3.jpeg",
                    "/images/destination/Wordsworth Lodge/img_4.jpeg",
                    "/images/destination/Wordsworth Lodge/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Boutique Hotel", "Secluded"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-ratan-vilas",
        slug: "ratan-vilas",
        title: "Ratan Vilas",
        description:
            "A nature-centric resort located near Gurushikhar, designed to blend into the jungle landscape.",
        details: {
            heading: "Nature's Abode",
            text: "Located on the Gurushikhar Road away from the town's congestion, Ratan Vilas is positioned as a nature-forward resort. While a modern property, it is notable for its setting, offering experiences like bird watching and hiking. The architecture utilizes natural materials to enhance the feeling of being at one with the hills and the surrounding jungle.",
            images: {
                main: "/images/destination/Ratan Vilas/img_1.jpeg",
                gallery: [
                    "/images/destination/Ratan Vilas/img_2.jpeg",
                    "/images/destination/Ratan Vilas/img_3.jpeg",
                    "/images/destination/Ratan Vilas/img_4.jpeg",
                    "/images/destination/Ratan Vilas/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Nature Resort", "Wildlife"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-bharatpur-palace",
        slug: "bharatpur-palace",
        title: "Bharatpur Palace",
        description:
            "Formerly the residence of the Bharatpur Maharaja, this palace is now known as Hotel Sunrise Palace.",
        details: {
            heading: "Royal Kothi",
            text: "Originally known as 'Brij Kothi' or 'Bharatpur Kothi,' this structure was built by H.H. Brijendra Singh of Bharatpur, a keen polo player who frequented Mount Abu. The palace holds historical significance as the initial residence of Dada Lekhraj Kripalani, founder of the Brahma Kumaris, when he first arrived in Mount Abu. It has since been converted into Hotel Sunrise Palace.",
            images: {
                main: "/images/destination/Bharatpur Palace/img_1.jpeg",
                gallery: [
                    "/images/destination/Bharatpur Palace/img_2.jpeg",
                    "/images/destination/Bharatpur Palace/img_3.jpeg",
                    "/images/destination/Bharatpur Palace/img_4.jpeg",
                    "/images/destination/Bharatpur Palace/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Not stated",
            timings: "Not stated",
            photography: "Not stated",
            ageLimit: "Not stated",
            quietHours: "Not stated",
            smoking: "Not stated",
            pets: "Not stated",
            notes: ["Heritage Hotel", "Historical Site"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "her-moors-cave",
        slug: "moors-cave",
        title: "Moor's Cave",
        description:
            "A hidden cave containing inscriptions from 1901 by Victoria Cross recipient Major General Arthur Thomas Moore.",
        details: {
            heading: "A Historical Mystery",
            text: "Discovered in 2006 near Sunset Point, this cave contains inscriptions carved by Major General Arthur Thomas Moore, a recipient of the Victoria Cross for bravery in 1857. The carvings are dated 1901, a time when Moore's whereabouts were historically unaccounted for. The site serves as a unique, tangible link to colonial military history and the personal life of a decorated officer.",
            images: {
                main: "/images/destination/Moors Cave/img_1.jpeg",
                gallery: [
                    "/images/destination/Moors Cave/img_2.jpeg",
                    "/images/destination/Moors Cave/img_3.jpeg",
                    "/images/destination/Moors Cave/img_4.jpeg",
                    "/images/destination/Moors Cave/img_5.jpeg",
                ],
            },
        },
        guidelines: {
            entryFee: "Free",
            timings: "Daylight hours",
            photography: "Allowed",
            ageLimit: "None",
            quietHours: "None",
            smoking: "Not advised",
            pets: "Allowed",
            notes: ["Historical Site", "Cave"],
        },
        location: {
            lat: 0,
            lng: 0,
            googleMapsLink: "",
        },
    },
    {
        id: "mkt-main-bazaar",
        slug: "mount-abu-main-bazaar",
        title: "Mount Abu Main Bazaar",
        description:
            "The primary commercial spine of the town, developed during the British period.",
        details: {
            heading: "Central Marketplace",
            text: "Developed alongside the growth of Mount Abu as a hill station. Focal point for daily trade, seasonal fairs, and tourist shopping. Known for Rajasthani handicrafts and wooden artifacts.",
            images: {
                main: "/images/destination/mount-abu-main-bazaar/main.jpeg",
                gallery: [
                    "/images/destination/mount-abu-main-bazaar/image_1.jpg",
                    "/images/destination/mount-abu-main-bazaar/image_2.jpg",
                    "/images/destination/mount-abu-main-bazaar/image_3.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Free",
            timings: "Open daily",
            photography: "Allowed",
            ageLimit: "None",
            quietHours: "Not enforced",
            smoking: "Not allowed",
            pets: "Not allowed",
            notes: ["Near Nakki Lake"],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "mkt-nakki-lake",
        slug: "nakki-lake-market",
        title: "Nakki Lake Market Area",
        description: "A vibrant promenade-style market encircling Nakki Lake.",
        details: {
            heading: "Lakeside Shopping",
            text: "Functions as a vibrant promenade market. Known for street shopping stalls, ice cream vendors, and evening souvenir shopping.",
            images: {
                main: "/images/destination/nakki-lake-market-area/img_1.jpg",
                gallery: [
                    "/images/destination/nakki-lake-market-area/img_3.jpg",
                    "/images/destination/nakki-lake-market-area/img_4.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Free",
            timings: "Open daily",
            photography: "Allowed",
            ageLimit: "None",
            quietHours: "Not enforced",
            smoking: "Not allowed",
            pets: "Not allowed",
            notes: ["Pedestrian friendly"],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
    {
        id: "mkt-tibetan",
        slug: "tibetan-market",
        title: "Tibetan Market",
        description:
            "Popular shopping stop for winter wear and imported handicrafts.",
        details: {
            heading: "Winter Wear & Handicrafts",
            text: "Established by Tibetan settlers. Popular for jackets, sweaters, and handmade accessories.",
            images: {
                main: "/images/destination/tibetan-market/main.jpeg",
                gallery: [
                    "/images/destination/tibetan-market/image_2.jpg",
                    "/images/destination/tibetan-market/image_3.jpg",
                    "/images/destination/tibetan-market/image_4.jpg",
                    "/images/destination/tibetan-market/image_1.jpg",
                ],
            },
        },
        guidelines: {
            entryFee: "Free",
            timings: "Open daily",
            photography: "Allowed",
            ageLimit: "None",
            quietHours: "Not enforced",
            smoking: "Not allowed",
            pets: "Not allowed",
            notes: ["Near Nakki Lake"],
        },
        location: { lat: 0, lng: 0, googleMapsLink: "" },
    },
];

// ==========================================
// 2. ECO-TOURISM & TREKS (Grouped by Start Point)
// ==========================================

export const trekGroups = [
    {
        startPoint: "Limdi Kothi",
        routes: [
            {
                id: "trek-limdi-shanti",
                title: "Shanti Shikhar",
                description:
                    "This trek begins from Limdi Kothi and gradually ascends through dense forest terrain toward Shanti Shikhar. The route is calm and scenic, making it suitable for training treks. Trekkers experience forest cover, rocky patches, and peaceful surroundings with rewarding views from the top.",
                images: { main: "", gallery: [] },
            },
            {
                id: "trek-limdi-aadesh",
                title: "Aadesh Cave",
                description:
                    "Starting from Limdi Kothi, this route leads through uneven forest trails toward Aadesh Cave. The trek involves rocky terrain and narrow passages. Inside the cave, trekkers witness naturally formed rock structures created by erosion, offering an adventurous cave exploration experience.",
                images: { main: "", gallery: [] },
            },
            {
                id: "eco-craigs-path", // Preserved ID
                title: "Craig’s Point",
                description:
                    "(Craig’s Point Trek) Named after British official Colonel Craig, this trek starts from Limdi Kothi and gradually becomes more challenging. Craig’s Point offers views of Anadra village and spectacular sunsets. The descent reaches a seasonal waterbed, followed by rock climbing sections and cave exploration. The trail opens onto a flat rock with stunning town views and returns via a 110-year-old British path, completing a circular trek of 3–5 hours.",
                images: {
                    main: "/images/destination/craig’s-path/main.jpg",
                    gallery: [],
                },
            },
            {
                id: "trek-limdi-table-rock",
                title: "Table Rock",
                description:
                    "This route passes through forest trails and rocky ascents toward the flat-topped Table Rock. The trek includes caves and scenic viewpoints. From the top, trekkers enjoy panoramic views of Nakki Lake, Mount Abu town, and surrounding hills.",
                images: { main: "", gallery: [] },
            },
            {
                id: "eco-limdi-kothi", // Preserved ID for Cave Trek
                title: "Adhar Devi Temple",
                description:
                    "(Limdi Kothi Cave Trek) Beginning at Adhar Devi Temple, this cave trek moves deep into the jungle. Craig’s Point and Table Rock share this route. After 10–15 minutes beyond the main trail, trekkers reach caves requiring the chimney technique to pass narrow rock gaps. The route is adventurous yet manageable and showcases impressive natural cave formations.",
                images: {
                    main: "/images/destination/Limdi Kothi Cave Trek/img_1.jpg",
                    gallery: [
                        "/images/destination/Limdi Kothi Cave Trek/img_2.png",
                        "/images/destination/Limdi Kothi Cave Trek/img_3.png",
                    ],
                },
            },
        ],
    },
    {
        startPoint: "St. Mary School",
        routes: [
            {
                id: "trek-stmary-hanuman",
                title: "Aarna Hanuman Ji Temple",
                description:
                    "This trek follows forest paths from St. Mary School to Aarna Hanuman Ji Temple. The route includes gradual ascents and rocky sections and is commonly used for spiritual walks and training treks. The temple is set in a peaceful forest environment.",
                images: { main: "", gallery: [] },
            },
            {
                id: "trek-stmary-spongy",
                title: "Spongy Hill",
                description:
                    "This trek passes through forest terrain with soft, leaf-covered soil, giving a spongy feel underfoot. It is best enjoyed during monsoon and winter and is suitable for beginners and nature walks.",
                images: { main: "", gallery: [] },
            },
        ],
    },
    {
        startPoint: "Guru Shikhar",
        routes: [
            {
                id: "trek-guru-utraj",
                title: "Utraj",
                description:
                    "Starting from Guru Shikhar, this trek descends through dense forest toward Utraj village. The route is remote and quiet, ideal for long-distance village trekking and exploration of rural forest landscapes.",
                images: { main: "", gallery: [] },
            },
        ],
    },
    {
        startPoint: "SVIM Institute",
        routes: [
            {
                id: "eco-plummy-peak", // Preserved ID
                title: "Plummy Peak",
                description:
                    "A commonly used training trek, this route passes through forest trails and gradual climbs. Plummy Peak offers scenic views of surrounding hills and is frequently included in mountaineering training programs.",
                images: {
                    main: "/images/destination/plummy-peak-trek/image_1.jpg",
                    gallery: [
                        "/images/destination/plummy-peak-trek/image_2.jpg",
                        "/images/destination/plummy-peak-trek/image_3.jpg",
                        "/images/destination/plummy-peak-trek/image_4.jpg",
                    ],
                },
            },
            {
                id: "eco-table-rock", // Preserved ID
                title: "Table Rock",
                description:
                    "(Table Rock Trek) Located on Shanti Shikhar Mountain near Gaumukh Road, this is one of the most popular beginner treks in Mount Abu. The flat rock resembles a large table. From the top, trekkers can view Nakki Lake, Mount Abu town, and Anadra village. A cave en route displays natural formations formed by water erosion.",
                images: {
                    main: "/images/destination/table-rock-trek/image_1.jpg",
                    gallery: [
                        "/images/destination/table-rock-trek/image_2.jpg",
                        "/images/destination/table-rock-trek/image_3.jpg",
                        "/images/destination/table-rock-trek/image_4.jpg",
                    ],
                },
            },
            {
                id: "eco-jesus-christ-trek", // Preserved ID
                title: "Jesus Christ Trek",
                description:
                    "This trek begins at SVIM Institute and leads through forested terrain toward the Jesus Christ rock formation. The route includes rocky climbs and narrow paths, making it suitable for training and exploration.",
                images: {
                    main: "/images/destination/jesus-christ-trek/main.jpg",
                    gallery: [],
                },
            },
        ],
    },
    {
        startPoint: "Gurukul School",
        routes: [
            {
                id: "trek-gurukul-salim",
                title: "Salim Ali Watch Tower",
                description:
                    "(Wild Rose Nature Trail) This biodiversity-rich trail follows the Wild Rose Nature Trail to Salim Ali Watch Tower. It is ideal for bird watching and nature studies. The watch tower provides elevated views of the forest canopy and surrounding wildlife habitat.",
                images: { main: "", gallery: [] },
            },
        ],
    },
    {
        startPoint: "Nakki Lake",
        routes: [
            {
                id: "trek-nakki-trevor",
                title: "Travors Tank",
                description:
                    "This peaceful trek descends from Travors Tank toward Nakki Lake through shaded forest paths. It is commonly used for relaxed walks and training treks, connecting remote forest zones to the town center.",
                images: { main: "", gallery: [] },
            },
            {
                id: "trek-nakki-adhar",
                title: "Adhar Devi Temple",
                description:
                    "This trek ascends from Nakki Lake toward Adhar Devi Temple via stone steps and forest trails. It is frequently used by pilgrims and trekkers and offers scenic lake views during the climb.",
                images: { main: "", gallery: [] },
            },
            {
                id: "eco-bailys-walk", // Preserved ID
                title: "Sunset Point (Bailey’s Walk)",
                description:
                    "(Bailey’s Walk) Bailey’s Walk is a historic forest trail named after British officer Sir Bailey. The route includes 54 steps leading to Aghai Goddess Temple and passes Rama Kund, Toad Rock, and Hathi Gupha. The trail is rich in rare vegetation and wildlife, including sloth bears, leopards, and diverse bird species.",
                images: {
                    main: "/images/destination/bailey’s-walk/main.jpg",
                    gallery: [
                        "/images/destination/bailey’s-walk/image_1.jpg",
                        "/images/destination/bailey’s-walk/image_2.jpg",
                        "/images/destination/bailey’s-walk/image_3.jpg",
                    ],
                },
            },
        ],
    },
    {
        startPoint: "Sunset Point",
        routes: [
            {
                id: "trek-sunset-palanpur",
                title: "Palanpur Point",
                description:
                    "This ridge walk offers expansive valley views and rocky terrain. Best experienced during early morning or evening hours, the trek provides wide panoramic landscapes.",
                images: { main: "", gallery: [] },
            },
        ],
    },
    {
        startPoint: "Abu Road",
        routes: [
            {
                id: "eco-abu-road-trek", // Preserved ID
                title: "Mount Abu",
                description:
                    "One of the longest treks in Mount Abu (16–18 km), this route begins near Rishikesh Temple behind Brahma Kumari’s Anand Sarovar. The trail passes dense forest, streambeds, and wildlife zones. Trekkers may encounter bears, leopards, porcupines, and seasonal forest berries.",
                images: {
                    main: "/images/destination/abu-road-to-mount-abu-trek/main.jpg",
                    gallery: [
                        "/images/destination/abu-road-to-mount-abu-trek/image_2.jpg",
                        "/images/destination/abu-road-to-mount-abu-trek/image_3.jpg",
                        "/images/destination/abu-road-to-mount-abu-trek/image_4.jpg",
                    ],
                },
            },
        ],
    },
    {
        startPoint: "Shergaon",
        routes: [
            {
                id: "eco-shergaon-trek", // Preserved ID
                title: "Guru Shikhar",
                description:
                    "This multi-day trek begins at Guru Shikhar, passes through Utraj village, and ends near Vashtanji Temple. Taking approximately three days, the route offers insight into traditional village life deep within dense forest.",
                images: {
                    main: "/images/destination/shergao-trek/image_1.jpg",
                    gallery: [
                        "/images/destination/shergao-trek/image_2.jpg",
                        "/images/destination/shergao-trek/image_3.jpg",
                        "/images/destination/shergao-trek/image_4.jpg",
                    ],
                },
            },
            {
                id: "trek-shergaon-rishikesh",
                title: "Rishikesh Temple",
                description:
                    "A long forest route connecting Shergaon village to Rishikesh Temple through quiet jungle paths and rural terrain.",
                images: { main: "", gallery: [] },
            },
            {
                id: "trek-shergaon-kedarnath",
                title: "Kedarnath Temple – Somnath Mahadev Temple",
                description:
                    "Starting near Utraj, this trail passes through Mount Abu Wildlife Sanctuary, known for its high biodiversity. Leopards, deer, oxen, and over 250 bird species inhabit this area. Two Shiva temples—Kedarnath and Somnath Mahadev—lie along the route, offering spiritual and scenic highlights.",
                images: { main: "", gallery: [] },
            },
        ],
    },
    {
        startPoint: "Tiger Path",
        routes: [
            {
                id: "eco-tiger-path", // Preserved ID
                title: "Sitawan (Gaumukh Road)",
                description:
                    "Also known as the Old Cart Road, this long-distance trek is used by the forest department for wildlife monitoring. The trail becomes narrow near Golden Horn Point and ends near Sitawan with views of Suraj Kund.",
                images: {
                    main: "/images/destination/tiger-path/image_1.jpg",
                    gallery: [
                        "/images/destination/tiger-path/image_2.jpg",
                        "/images/destination/tiger-path/image_3.jpg",
                        "/images/destination/tiger-path/image_4.jpg",
                    ],
                },
            },
            {
                id: "eco-jalandharnath", // Preserved ID
                title: "Jalandharnath",
                description:
                    "One of the toughest treks in Mount Abu, this route leads to Jalandharnath Temple dedicated to Lord Shiva. The trail is steep, slippery, and physically demanding. From the summit, trekkers can see Abu Road city.",
                images: {
                    main: "/images/destination/jalandharnath-trek-toughest-trek-in-abu/image_1.jpg",
                    gallery: [
                        "/images/destination/jalandharnath-trek-toughest-trek-in-abu/image_2.jpg",
                        "/images/destination/jalandharnath-trek-toughest-trek-in-abu/image_3.jpg",
                        "/images/destination/jalandharnath-trek-toughest-trek-in-abu/image_4.jpg",
                    ],
                },
            },
        ],
    },
];

// ==========================================
// 3. EXPORTS & HELPERS
// ==========================================

export const unexploredGems = destinations.filter((d) =>
    d.id.startsWith("gem-"),
);
export const topDestinations = destinations.filter((d) =>
    d.id.startsWith("top-"),
);

// Functional categories (excluding Treks from here as they are now in trekGroups)
export const functionalCategories = {
    temples: destinations.filter(
        (d) =>
            d.title.toLowerCase().includes("temple") ||
            d.title.toLowerCase().includes("ashram"),
    ),
    viewpoints: destinations.filter(
        (d) =>
            d.id.startsWith("view-") ||
            d.id === "top-sunset-point" ||
            d.title.includes("Point") ||
            d.title.includes("Rock"),
    ),
    wildlife: destinations.filter(
        (d) => d.id.startsWith("wild-") || d.id === "top-trevors-tank",
    ),
    heritage: destinations.filter(
        (d) => d.id.startsWith("her-") || d.id === "top-achalgarh",
    ),
    markets: destinations.filter((d) => d.id.startsWith("mkt-")),
};
