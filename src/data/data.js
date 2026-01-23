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
                title: "St. Mary School → Spongy Hill",
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
                title: "Shergaon → Rishikesh Temple",
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
