--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: nft_marketplace; Type: DATABASE; Schema: -; Owner: henson
--

CREATE DATABASE nft_marketplace WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'English_United States.1252';


ALTER DATABASE nft_marketplace OWNER TO henson;

\connect nft_marketplace

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auctions; Type: TABLE; Schema: public; Owner: henson
--

CREATE TABLE public.auctions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date DEFAULT CURRENT_DATE NOT NULL,
    block_hash character varying(100) NOT NULL,
    block_timestamp date DEFAULT CURRENT_DATE NOT NULL,
    transaction_hash character varying(100) NOT NULL,
    transaction_index character varying(100) NOT NULL,
    token_decimal numeric NOT NULL,
    token_id integer NOT NULL,
    log_index integer NOT NULL,
    block_number character varying(100) NOT NULL,
    function_name character varying(20) NOT NULL,
    function_desc character varying(200) NOT NULL,
    marketplace_address character varying(100) NOT NULL,
    nft_address character varying(100) NOT NULL,
    price numeric NOT NULL,
    price_decimal numeric NOT NULL,
    measurement_unit character varying(20) DEFAULT 'ETH'::character varying NOT NULL,
    owner character varying(100) NOT NULL,
    creator character varying(100) NOT NULL,
    start_time date NOT NULL,
    end_time date NOT NULL,
    collection_id uuid NOT NULL
);


ALTER TABLE public.auctions OWNER TO henson;

--
-- Name: collection_categories; Type: TABLE; Schema: public; Owner: henson
--

CREATE TABLE public.collection_categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255),
    image character varying(100)
);


ALTER TABLE public.collection_categories OWNER TO henson;

--
-- Name: collections; Type: TABLE; Schema: public; Owner: henson
--

CREATE TABLE public.collections (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date DEFAULT CURRENT_DATE NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255),
    logo character varying(100) NOT NULL,
    featured_image character varying(100),
    banner character varying(100),
    url_format character varying(100),
    creator character varying(100) NOT NULL,
    owner character varying(100) NOT NULL,
    website character varying(100),
    discord character varying(100),
    telegram character varying(100),
    instagram character varying(100),
    facebook character varying(100),
    youtube character varying(100),
    category_id uuid
);


ALTER TABLE public.collections OWNER TO henson;

--
-- Name: listings; Type: TABLE; Schema: public; Owner: henson
--

CREATE TABLE public.listings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date DEFAULT CURRENT_DATE NOT NULL,
    block_hash character varying(100) NOT NULL,
    block_timestamp date DEFAULT CURRENT_DATE NOT NULL,
    transaction_hash character varying(100) NOT NULL,
    transaction_index character varying(100) NOT NULL,
    token_decimal numeric NOT NULL,
    token_id integer NOT NULL,
    log_index integer NOT NULL,
    block_number character varying(100) NOT NULL,
    function_name character varying(20) NOT NULL,
    function_desc character varying(200) NOT NULL,
    marketplace_address character varying(100) NOT NULL,
    nft_address character varying(100) NOT NULL,
    price numeric NOT NULL,
    price_decimal numeric NOT NULL,
    measurement_unit character varying(20) DEFAULT 'ETH'::character varying NOT NULL,
    owner character varying(100) NOT NULL,
    creator character varying(100) NOT NULL,
    start_time date,
    end_time date,
    collection_id uuid NOT NULL
);


ALTER TABLE public.listings OWNER TO henson;

--
-- Name: nft_history; Type: TABLE; Schema: public; Owner: henson
--

CREATE TABLE public.nft_history (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date DEFAULT CURRENT_DATE NOT NULL,
    block_hash character varying(100) NOT NULL,
    block_timestamp date DEFAULT CURRENT_DATE NOT NULL,
    transaction_hash character varying(100) NOT NULL,
    transaction_index character varying(100) NOT NULL,
    block_number character varying(100) NOT NULL,
    token_decimal numeric NOT NULL,
    token_id integer NOT NULL,
    log_index integer NOT NULL,
    function_name character varying(20) NOT NULL,
    function_desc character varying(200) NOT NULL,
    nft_address character varying(100) NOT NULL,
    marketplace_address character varying(100) NOT NULL,
    from_address character varying(100) NOT NULL,
    to_address character varying(100) NOT NULL,
    value integer,
    collection_id uuid NOT NULL
);


ALTER TABLE public.nft_history OWNER TO henson;

--
-- Name: nfts; Type: TABLE; Schema: public; Owner: henson
--

CREATE TABLE public.nfts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date DEFAULT CURRENT_DATE NOT NULL,
    block_hash character varying(100) NOT NULL,
    block_timestamp date DEFAULT CURRENT_DATE NOT NULL,
    transaction_hash character varying(100) NOT NULL,
    transaction_index character varying(100) NOT NULL,
    token_decimal numeric NOT NULL,
    token_id integer NOT NULL,
    log_index integer NOT NULL,
    block_number character varying(100) NOT NULL,
    function_name character varying(20) NOT NULL,
    function_desc character varying(200) NOT NULL,
    marketplace_address character varying(100) NOT NULL,
    nft_address character varying(100) NOT NULL,
    price numeric NOT NULL,
    price_decimal numeric NOT NULL,
    measurement_unit character varying(20) DEFAULT 'ETH'::character varying NOT NULL,
    owner character varying(100) NOT NULL,
    creator character varying(100) NOT NULL,
    approved boolean DEFAULT false NOT NULL,
    start_time date,
    end_time date,
    status character varying(10) DEFAULT 'unlisted'::character varying NOT NULL,
    collection_id uuid NOT NULL,
    CONSTRAINT nfts_status_check CHECK ((((status)::text = 'listed'::text) OR ((status)::text = 'unlisted'::text) OR ((status)::text = 'auctioned'::text)))
);


ALTER TABLE public.nfts OWNER TO henson;

--
-- Name: offers; Type: TABLE; Schema: public; Owner: henson
--

CREATE TABLE public.offers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date DEFAULT CURRENT_DATE NOT NULL,
    block_hash character varying(100) NOT NULL,
    block_timestamp date DEFAULT CURRENT_DATE NOT NULL,
    transaction_hash character varying(100) NOT NULL,
    transaction_index character varying(100) NOT NULL,
    token_decimal numeric NOT NULL,
    token_id integer NOT NULL,
    log_index integer NOT NULL,
    block_number character varying(100) NOT NULL,
    function_name character varying(20) NOT NULL,
    function_desc character varying(200) NOT NULL,
    marketplace_address character varying(100) NOT NULL,
    nft_address character varying(100) NOT NULL,
    price numeric NOT NULL,
    price_decimal numeric NOT NULL,
    measurement_unit character varying(20) DEFAULT 'ETH'::character varying NOT NULL,
    owner character varying(100) NOT NULL,
    offerer character varying(100) NOT NULL,
    deadline date,
    collection_id uuid NOT NULL
);


ALTER TABLE public.offers OWNER TO henson;

--
-- Data for Name: auctions; Type: TABLE DATA; Schema: public; Owner: henson
--

COPY public.auctions (id, created_at, updated_at, block_hash, block_timestamp, transaction_hash, transaction_index, token_decimal, token_id, log_index, block_number, function_name, function_desc, marketplace_address, nft_address, price, price_decimal, measurement_unit, owner, creator, start_time, end_time, collection_id) FROM stdin;
\.


--
-- Data for Name: collection_categories; Type: TABLE DATA; Schema: public; Owner: henson
--

COPY public.collection_categories (id, name, description, image) FROM stdin;
4f8acdcc-5e91-46fb-91ca-0a7f84d4ac17	art	Welcome to the home of ART on @HK Market. Discover the best items in this collection.	https://ipfs.io/ipfs/QmSnkmzzB3x54segizz2dfXm3jXdpAg6kyMs2wDvRQ23Kt
397c9e96-c2c6-47d2-bc2b-361eb9a2a76c	photo	Welcome to the home of photography on @HK Market. Discover the best items in this collection.	https://ipfs.io/ipfs/QmVhWDYiS9Hwa8DvS838ijRBZmqeXGSN6gNFLRWd6ZpEBh
3821b909-83a5-4443-b5fd-95c4756da27b	sports	Welcome to the home of sports on @HK Market. Discover the best items in this collection.	https://ipfs.io/ipfs/QmZVXuM7T788ExinjNL7pAf2abDQvspHs6QZDsrXSM5R82
ebf33bf8-01ab-4634-9a94-82eeb6ad23a0	music	Welcome to the home of music on @HK Market. Discover the best items in this collection.	https://ipfs.io/ipfs/QmPRt8cDsVNa4LHoe7S9h6GcFKZJUjWUyvJRYBK6kNDV6C
1de7c0fd-4232-4b9e-b722-2f83bacfc5fd	collectibles	Welcome to the home of collectibles on @HK Market. Discover the best items in this collection.	https://ipfs.io/ipfs/QmV56WE113GKrgJ8xv1FBDfmUULJjabsq3yXZL4L6BWycF
\.


--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: henson
--

COPY public.collections (id, created_at, updated_at, name, description, logo, featured_image, banner, url_format, creator, owner, website, discord, telegram, instagram, facebook, youtube, category_id) FROM stdin;
4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1	2022-08-26	2022-08-26	Collection 1	Description of my art collection 1	ipfs://QmP4e8eJstyVpwYVCtFbjtD14jPxemXMsSkPCqwftfyh69	ipfs://QmP4e8eJstyVpwYVCtFbjtD14jPxemXMsSkPCqwftfyh69	ipfs://QmPGaSYYekRv7CuvnittfQ62itiATaetizWowbF3KiTQUW	\N	0x95867adc0c0b29ed0b8e1ea7ca8abae00f754d7f	0x95867adc0c0b29ed0b8e1ea7ca8abae00f754d7f	https://henson-kudi.github.io/my-portfolio/	https://henson-kudi.github.io/portfolio/	https://henson-kudi.github.io/portfolio/	https://henson-kudi.github.io/portfolio/	https://henson-kudi.github.io/portfolio/	https://henson-kudi.github.io/portfolio/	4f8acdcc-5e91-46fb-91ca-0a7f84d4ac17
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: henson
--

COPY public.listings (id, created_at, updated_at, block_hash, block_timestamp, transaction_hash, transaction_index, token_decimal, token_id, log_index, block_number, function_name, function_desc, marketplace_address, nft_address, price, price_decimal, measurement_unit, owner, creator, start_time, end_time, collection_id) FROM stdin;
f9082d2e-4a6c-4ede-a42a-0efc0618d4d4	2022-08-26	2022-08-26	0x6d82b2351aa0cdb63a7ab23a0098a510627b13b2fdc7db360a30219dbd789d75	2022-07-26	0xc1b78d8dd9cfe5cdd49d54d35b4836d793aba18e5b4acc83b73eff28005c9c54	0	9	9	0	51	listItem	Listing to marketplace	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	12000000000000000000	12	@HK	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	2022-08-26	2022-09-10	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
fdbb811f-48cb-4207-bd65-3959a4810898	2022-08-27	2022-08-27	0x2a22164ded7cc1b57f887eee87e47e00a5ce2ff24ba601d5dbf3cb52d76aa7e9	2022-07-27	0xb9165a92f0f9a8203eb71ada530d044dcd14ad65620780d73c3fd11d0618ce04	0	9	9	0	54	listItem	Listing to marketplace	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	10000000000000000000	10	@HK	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	2022-08-27	2022-09-11	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
8be3b37e-2163-4551-affa-bc36ab7b3363	2022-08-29	2022-08-29	0x844ca76c2ce4cca078df73bde449179221a1652fe67d52f682a6c5041da52cc6	2022-07-29	0x30e997228c847a261e9db7d0e322d5495c7459f3e0be5bcf99ac04c212cb5ca1	0	12	12	0	137	listItem	Listing to marketplace	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	10000000000000000000	10	@HK	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	2022-08-29	2022-09-13	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
\.


--
-- Data for Name: nft_history; Type: TABLE DATA; Schema: public; Owner: henson
--

COPY public.nft_history (id, created_at, updated_at, block_hash, block_timestamp, transaction_hash, transaction_index, block_number, token_decimal, token_id, log_index, function_name, function_desc, nft_address, marketplace_address, from_address, to_address, value, collection_id) FROM stdin;
793c276b-47d9-4a9e-b11e-b223fe2d760c	2022-08-27	2022-08-27	0xe6d5f16682855ee72272311309595047f7b5502c7aba331bbc891918313dda96	2022-07-27	0x58c3e54bc99d37bd35216aa12eb5805e07b2f5881a96e1685779cb6faabadf1b	0	52	9	9	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
741c91e5-b567-4816-b769-677f46197785	2022-08-27	2022-08-27	0xc07908e8795a68c737e177d51c1e62e675a3e84da46eedc50a6264e1b3871db5	2022-07-27	0x8a1b5042864e06eb7aea125067cb47f8c6050ab542918fec45c7a7a9233cb299	0	58	10	10	0	mintNft	minted nft token	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
fff6bb2e-5326-4211-95a2-7b1487d95761	2022-08-27	2022-08-27	0xa5f72865389169f00bcad4e34592128dec24433622f3e74d5dd2492f47e8822e	2022-07-27	0x1507779f3a737c4162c648bf5a6a0f46af58aca1536c270936eb655e873d556b	0	61	10	10	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	12	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
056b92b8-5c81-4f79-848a-44c328ca1f5d	2022-08-28	2022-08-28	0x1d7020a2a8f642f687c031beaae7d2924de3d1c396e39bcd209507fbbe62a5b9	2022-07-28	0xe0295636c431f0a66bed8bb274457125127e17586d89927bb99caf6bb873b46a	0	64	11	11	0	mintNft	minted nft token	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
6a445a19-80a5-4927-9f16-b12b9dd06170	2022-08-28	2022-08-28	0xefb7233f60f2ac7594aa3da90e386bb7a7ed657a2cd36ff584f9406ab63dbc31	2022-07-28	0x43dde42e544cf19861d0d953b4b2f95ff9ea3313ba31ac84a7bf40fc512178d3	0	67	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	12	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
216833b2-cb4f-4760-90ea-4cd5d8be6384	2022-08-28	2022-08-28	0x486e0b6d0608468ab0dc8c6f654e2337fb1deb55cb675c7413882c511fdd11ee	2022-07-28	0x45c571b8808edba457943aee89aeff4b952e964db17c0674fbedc7e09db6fe65	0	68	11	11	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
1d844ba5-85a2-4942-a81a-dd6e3ead678a	2022-08-28	2022-08-28	0x7a9e8ca532eb621e92115cf9b66f79e6dd536696e2fb8dd47ca082909840fd0c	2022-07-28	0x178c0755a315c8e69a5dfb405f1b264d8cb92f2a009716c8cbfe8d17c74baea8	0	69	11	11	0	offer	Make Offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	10	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
2341058b-f619-477e-a447-5a6da74c4933	2022-08-28	2022-08-28	0x35edabcf3e64c43b52cbc7ec80407da4fca59bd74253b16f3653139f02f83a2e	2022-07-28	0xd03ffdae46620195fa99bfaa522f59dc17260fc4ff4600d0c0a0f8a096c37175	0	71	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	13	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
265e381b-21a1-47b8-8b89-911723308c5c	2022-08-28	2022-08-28	0xd78cce2126aba67ac88dd57a83ac841e18fce51946f32bae56a6a3bd6e462d70	2022-07-28	0x84b2c53bacf180d44a7f4b699bcf467f90be96f8020b393d434ee7a13343f9f0	0	72	11	11	0	offer	Make Offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	9	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
08b00bfe-9c9d-4699-8ce8-7eca741db640	2022-08-28	2022-08-28	0x1ba827d3fcdd4db16732c78cc4a1ddcf861071bb7c0f4bc2aad8c7c8151e3af4	2022-07-28	0xa7899f260a52fd8ea80fe2ff9808fef620ca4b84e9356fa27c613c30d657a2c4	0	73	11	11	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
f3a9d0aa-dbd4-4aba-9275-440af3d0f447	2022-08-28	2022-08-28	0x8494862d1733d0ff33f92d79795cc27f9d6a101e88ace8d267cf166ceaaf19f1	2022-07-28	0xb476790e6fd326991a734788b404594078ec990debdf94962c7fd9ec0204336f	0	75	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	15	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
9b3dda1c-909d-4b2a-aa56-c9fa93d95496	2022-08-28	2022-08-28	0xb5fc127fda36e972102a45ad3d54bc25a43a5462e99ec837fc60ffa454ce33a5	2022-07-28	0xd80c1a4f6bc905720da2a56bba0f41fcdba6bdb71e8cdd62eb21aa1c8fdbd707	0	76	11	11	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
751a3da9-cef2-4880-b2bb-b64d7d44a7ab	2022-08-28	2022-08-28	0x00124021963ec8fa78aead61b179ec9f44cc933610936150c8eb83fccc7a8b7c	2022-07-28	0x74f823b2a92db8794631d024b5f2baa3ebc88e22d716ffdfc09d94463ac121d3	0	78	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	20	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
486f0fd3-5f6e-4131-b617-9793897f16f9	2022-08-28	2022-08-28	0x144063a157cef14984c6f8b6f4d886f7ad11075edac80b87a7cc51fc7920b887	2022-07-28	0xca1310a799c7c130809ae64c9af665e43cd9dab9a863b959e99dd2e83a015604	0	79	11	11	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
2fcbbb42-b3f9-4863-b3c2-4291e7cf863b	2022-08-28	2022-08-28	0xff47a291b0eb07013175a511ccaff1abcf4ee168391a226b6f5dd972eabe44b3	2022-07-28	0xf96fbca2c1448603276007a6d712640ada780465cfacacf0d2b04ea1f3d35c5c	0	81	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	15	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
949c444c-c337-45f5-9e56-66a3670b8cc4	2022-08-28	2022-08-28	0xe9ab630bc1e5e3d44d5ca1ee33fb5d84061d7c459a1a8fef5bbf4ac491d90c02	2022-07-28	0x985a56040b96530a0d7cefcdb8ed91dc7e1554ca5942fbb5f190a4970ce6bfd0	0	82	11	11	0	bid	Place Bid	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	15	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
bff48051-e48e-4745-80f6-7021509ef9bc	2022-08-28	2022-08-28	0x5e574f432a51f4489f00c0ae1f91697d2401f966b7d00e7dd3976d9a688a8490	2022-07-28	0xf1b58ead0fc53b1f08e50ae709edb85483cb46b04c6426e30cc70d5865ca1759	0	87	11	11	0	acceptOffer	Accepted offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
2ea22da4-cd21-4835-823a-e78ea8ddc265	2022-08-28	2022-08-28	0xeb0086a3e6ddb63e16c6bb798a3c05ee491a81002a4e55f8ff37dcf9e3c4c0a3	2022-07-28	0x1e559f31403a3f2cbd51bd9c7235ba8983706d469c176bf6a0cd3230a7640e2d	0	88	11	11	0	bid	Place Bid	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	30	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
fb829092-fc13-445e-9de1-e1ba193c1ed1	2022-08-28	2022-08-28	0x2a7aa919350ab7ab6b8d54d86268987663c266fed339046b2b3b8a9c5a0f8ac6	2022-07-28	0x7328fc64e8f1768a04ecf9f972a8404dfa9ed1d1536b407b12bc8e7be32566d4	0	89	11	11	0	acceptOffer	Accepted offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
b1d90368-c104-4aee-a72d-5574638c21c9	2022-08-28	2022-08-28	0xa4e2f529fa4ee021c20116240edeccd4611120aacc19f428de134991459b00a9	2022-07-28	0x3bbbaaa325e8423671db976a64cf053d2e169aa9ff7d17aaad1ebaeea681cee9	0	91	11	11	0	bid	Place Bid	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	20	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
fbf6f3f9-5dfb-4a25-9ae6-117d2eba932e	2022-08-28	2022-08-28	0x24d38187da39e168d40d19bad8dfed42d1b15c05fd6ff86077ff04d9c585ca55	2022-07-28	0x0500c0f6e1dcb0248ba0901de96158bd86f5c66aaf34b5939ac637db48608ad9	0	97	11	11	0	bid	Place Bid	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	21	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
2b9cded2-9408-4ef3-a02d-b0408a082a4f	2022-08-28	2022-08-28	0x6e8c62fd53b1f32049a1c328244e576daeeeb4ad084d81bb26910bb3f8ec7ca4	2022-07-28	0x2f57d5eabb955ef390c8cbe7f46c4b5d4bf650ca808de8c46a4a520d8ed2b611	0	98	11	11	0	acceptOffer	Accepted offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
560d6f41-710f-400a-b368-3dc9aa5ed247	2022-08-28	2022-08-28	0xb04f0ff264dd9ad628bd2d77a773a04a34e61bf97b5cafbfd2c274dbb802d964	2022-07-28	0xbd8a346bd719e32a13bd0bb7549db24d5acb263f2296ce616fbad206018de878	0	101	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	10	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
b402176e-0531-48f4-9416-6609e84018bf	2022-08-28	2022-08-28	0x1c37ec85de9dbcafd0f5bbe6a5b90eb5f09abf2f94affb56e163485ded16358c	2022-07-28	0xaa3617fe17a733fe423fdd7d6f04bb1ba12a6ebb3c63ce848af05c7162dc88f4	0	102	11	11	0	offer	Make Offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	9	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
78a8efad-482f-4d9b-b7fb-5af24fcc16f8	2022-08-28	2022-08-28	0x4d911993b5840e9dcf19b59a4f1435e1d1294e97fb7fb50bc9605b8abe38e331	2022-07-28	0xd7767fd79a34534a0756372811098d29ba15f1f453d8ba1fd8b8fcf754b0d89b	0	103	11	11	0	rejectOffer	Rejected offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
47c71672-b088-4c84-83bc-37dfb10a98cd	2022-08-28	2022-08-28	0xa20b10d34746426f74334e2ace5a24c8303d746cc3f85755ae8c134e44196435	2022-07-28	0x00c514b3cc45b9fb7c035748785e63a7c1084aa4deb05e70c696213ded0e25d8	0	106	11	11	0	offer	Make Offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	12	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
b72d5d77-6cf2-4c47-8dc3-73fa2d855562	2022-08-28	2022-08-28	0x7b7cc12bcabcef20dc1ec61254e60ec752590355dc8f0e05f5128a671b32c02d	2022-07-28	0xd2cccacdafa88cbed2590ea85159651f35a53cd6ef9ec85d9071caddb30c04c9	0	107	11	11	0	updateOffer	Make Offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	10	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
689d1b9c-2736-4451-9b68-3d01211487e5	2022-08-28	2022-08-28	0x77cbdf4b4df80716adc89eaa2e2da654569410f39fe1f644696b82b8d4e352cc	2022-07-28	0xfda62d841594db6a7a4d43699881419255f6bcd2c7371a0f090c13666573b4fc	0	108	11	11	0	updateOffer	Make Offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	10	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
8aba9fcd-78a6-4941-bdd7-2bcfad0c0ff0	2022-08-28	2022-08-28	0x320d1afae00abd5407cab66e09206a575344cc08a46ef505d0aa5caa565e04b5	2022-07-28	0x8fb10ca63fd67b78ffb696396677fc0f52f28fb729b38a42d25653ed5604c9b0	0	109	11	11	0	acceptOffer	Accepted offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
3b7b2e30-98b4-4397-8265-eacdb1ccafa7	2022-08-28	2022-08-28	0xe18b5fbd3564da9ff414f239e96e5592a5c109034d0a881308299de94e4b8ce2	2022-07-28	0x66862469bad4b3e986b91ea8be90dd41d6b3708f9ed843e48ae62811987fbbd2	0	110	11	11	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
4429d475-367c-4460-b962-057b01432157	2022-08-28	2022-08-28	0xb7c69e6f07193e4c24a4ca14b3ffd577fff2bc0b80314b0e73ea7953399e7cd9	2022-07-28	0xdc03ff9417f97add9f73ac2be19dd971f57eb2f8b8a42b0720f1cf8777a2ef12	0	112	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	10	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
0e6b92b1-f806-4092-bb61-380340437968	2022-08-28	2022-08-28	0x100f6a22321b04970fb77c9f56e7af06342271190699b423e3a8df1603f99875	2022-07-28	0xa7ff13902dbb2fb6f96b0d702631b5f0e2105c20c0cf54612cf4142eeede02b7	0	113	11	11	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
4adacc0f-553b-45ca-91cb-6621e73da9f7	2022-08-28	2022-08-28	0xc6357ca6f2fc13005ccab2dda85c0d988f476b96fab5a348be53f321f2a2d38d	2022-07-28	0xf3d2ddbcd1163b75279c61f1a714468c0326b7e49b45a74bb57abf409015561c	0	114	10	10	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
e6fb87f9-6600-4713-8e2e-bcd76b3fc5e6	2022-08-28	2022-08-28	0xdaed6d664ab481080fef9e2c9af57032fa833db257cf90ac9c7930086f8582bf	2022-07-28	0x1eea72ac79c4e26dd7370d5450661c14f43a3931a72f7195fe6aaa0d88873a0d	0	115	11	11	0	bid	Place Bid	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	10	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
71e0abd8-5e95-4936-b796-f1f0cc68c980	2022-08-28	2022-08-28	0xd3612cd11f3722189c796f01656f172e19ae0f717d564361013269cae47f5de5	2022-07-28	0x6a86d0d313e546a3c39b3ec81290a9250a5b3b73b6f5020ad024b0cf24790015	0	116	11	11	0	updateBid	Update Bid	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	15	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
cf7f1d7e-fbf7-47f4-8a65-4a4e40ac278b	2022-08-28	2022-08-28	0xbab5d1962c69f95bb5f04a092f3edcc0d05029806ad39f2ac7e464dd18a72c27	2022-07-28	0xb9b4ca93733dca88eeca5a8aa501c2ecabc4eee728700197cee1a614092a96cd	0	119	11	11	0	rejectOffer	Rejected offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
09aeceb0-0ef8-4e86-8b43-05f66108a4ef	2022-08-28	2022-08-28	0xab46f53b67fe82b5790c4e73d2b6460b7a13afb25129b98e0a66d71655428c04	2022-07-28	0x386f852db5918d37d650b8fd5ad550fc4c4ad4c734e928c70d1918b3e6a07bb9	0	121	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	15	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
c6b59dd0-6b72-472e-8131-e0e75031a985	2022-08-28	2022-08-28	0x09e3d73ecf7cd5e095c8e3c622553d9fe41bb1edf48c4b5adaaf40a0aecc5c11	2022-07-28	0xb7e4e4de13663f314ef42152043f506da61b087a9e843cd1c4f8a64adfe2c369	0	122	11	11	0	bid	Place Bid	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	17	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
fd385842-22a2-4541-89c4-0b51d027b99c	2022-08-28	2022-08-28	0x8a479e1fa477169b0ede84260c22f1a5afd51a19ed76b0ebbfccad55dbc11780	2022-07-28	0xeae681fa0236733e40ec32bdb22fa2dd539c62169c5f1f5ccde3d986287f5038	0	123	11	11	0	acceptOffer	Accepted offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
867b41a8-7453-4d4e-adf5-38e3a4f47486	2022-08-28	2022-08-28	0xd06c8336134dcb193856ccf61fb2f47425405896eac63c2be4bf8aeeb8b609f5	2022-07-28	0xb97b44292cb1360a18fe977aa44ff1a1466e021d337ed572cfa9fb15232e70d6	0	124	11	11	0	bid	Place Bid	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	16	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
f161d0e9-5901-48ae-bcea-cfd6a4f3671e	2022-08-28	2022-08-28	0x2e137c0ea9f2ad42d6e2af0723d3d67e6c46998f495a95e7c456966be96acb25	2022-07-28	0xdc252d08b90045450c8009c934b2af3e0a66f61b36daf1c7f61cbd93138de2a1	0	126	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	12	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
3c9f3e28-85b7-4e2e-b0e4-dc31a531135b	2022-08-28	2022-08-28	0xaa8dc904f00e826c7bfdac050231421f90f7fe3134010c5d9c2e132e5bf2679c	2022-07-28	0xbaa501a929105998e44ff26b9f10f500661e72bfc2af8cb975c5bf26c34ed7bd	0	127	11	11	0	acceptOffer	Accepted offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
f0f3fbf9-c9ae-4b24-a859-189a926ff66d	2022-08-28	2022-08-28	0x8e58d89edea9d65c3e6a5ffd8fe1946b5dc9349496f429ffc85d24b70718c494	2022-07-28	0x4530410460aa840bd727056b458db1a90e6302cc24a6a5fe3c97a3dc990d1dae	0	129	11	11	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	9	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
bee59ce3-092b-4fb2-8203-98cb31e2d3e2	2022-08-28	2022-08-28	0xc03fcb3e7b7fd354699849eeef624582afd0c66436f802c2dfaaa7eee1023325	2022-07-28	0x69dabda4106b79b3f7979fd904123afdf87735fe08ed6c6a83a297a51262f329	0	130	11	11	0	buy	token transfered	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	\N	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
fbb1a541-7bb0-43ca-ae37-efb6b4948030	2022-08-28	2022-08-28	0x120354d2214fee1ced61021f9d2b3a6b300959581e438a05d40e0d865300508c	2022-07-28	0xc9a760adff73a5eec22b7fb3b946f95c33d7fc817378b099c0940271c69a78f8	0	131	11	11	0	offer	Make Offer	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	12	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
468c440e-9baa-4d45-bf28-a34ebe4fa871	2022-08-29	2022-08-29	0xb34d4c5f482ad8c56b4668b832d07a0343fea02014d627945376602ff8ee04df	2022-07-29	0x9143fcd846491496542dd83f13e026b45a1e9e1509a417722bbe62b5accca077	0	134	12	12	0	mintNft	minted nft token	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
89a3212b-30a3-4c61-ac48-64d202f0b25c	2022-08-29	2022-08-29	0x844ca76c2ce4cca078df73bde449179221a1652fe67d52f682a6c5041da52cc6	2022-07-29	0x30e997228c847a261e9db7d0e322d5495c7459f3e0be5bcf99ac04c212cb5ca1	0	137	12	12	0	listItem	Listing to marketplace	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	10	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
05aeb63d-aeca-4bec-9447-b6f86c0ed6c4	2022-08-29	2022-08-29	0xaa751fa5a1085445d4bd5ec7dab1d424d02adeb86f1b77166305fd391be8dce9	2022-07-29	0x4475d6613966b37a06a636151df56b172fd8e4e7bbce1d244ba72fc85b6a6ceb	0	138	12	12	0	updateListing	Updated Listing	0x5FbDB2315678afecb367f032d93F642f64180aa3	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x70997970C51812dc3A010C7d01b50e0d17dc79C8	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	8	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
\.


--
-- Data for Name: nfts; Type: TABLE DATA; Schema: public; Owner: henson
--

COPY public.nfts (id, created_at, updated_at, block_hash, block_timestamp, transaction_hash, transaction_index, token_decimal, token_id, log_index, block_number, function_name, function_desc, marketplace_address, nft_address, price, price_decimal, measurement_unit, owner, creator, approved, start_time, end_time, status, collection_id) FROM stdin;
4f163111-3cbf-49cb-9743-8abc2ccca85d	2022-08-26	2022-08-26	0xcf058c8a2809fe5dd2d0f6bca46a24673ff018173da2429442ebec3dd5b60b75	2022-07-26	0x7a1b0c95055c763e9dfd34c733e14f2800042f1fb491dcc0b1b8c2bcc4176ba1	0	2	2	0	4	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	0	@HK	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	f	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
db2f28fb-7ee9-4140-b145-9a6ad64b79d5	2022-08-26	2022-08-26	0xed556d85846e27a9137e160638ee6dda82d59fa028e27aee6f8dc1e9da25c19e	2022-07-26	0xe3430b61411e8d8e67003753bdd27ef539ebfa50e4422a9d3f49b02d4000c523	0	6	6	0	36	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	0	@HK	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	f	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
dc61d93b-4f08-4315-8468-2735610393d3	2022-08-26	2022-08-26	0x2a36fe8a33535627ae6885acd193668f1f3508fbfe70907d19c70e02662ecdf6	2022-07-26	0x4fc71338c9f04ab2a523bde402c4aa255e6ded8055932f998f049e89de42e233	0	3	3	0	6	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	0	@HK	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	t	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
3089b751-94e0-4723-9b97-2c29e9e5ecb7	2022-08-26	2022-08-26	0x87917b29eea489d8af35d5cb48cb703a6ec62c28c31c310047f1d0d83764a608	2022-07-26	0x55515e2df0517d56b2a803c33f76bb7c63f86a57b609f94837b26b8f758b3d17	0	4	4	0	15	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	0	@HK	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	t	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
c6f14b81-1785-482a-aa25-6e93999ea4df	2022-08-26	2022-08-26	0x23c8d085d33fdc71f87a183de658ea2c3f733cab7726840a6b52144c03246a92	2022-07-26	0xad2e2bd39b714c250c36019726fc847e42ba63ff30d50c5f79999fd8b0174775	0	7	7	0	38	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	0	@HK	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	t	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
87eaf8be-447b-4398-883f-40996abb7a2e	2022-08-26	2022-08-26	0xcd409d6e56d462d429b78555d23f5ddfd58a8045b59424d2233b6351b50fd10b	2022-07-26	0x1c2625dd343d49d3655b3b69c84854fbe790066c42ff645b9937aee5e36ceabf	0	8	8	0	44	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	0	@HK	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	t	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
19a95865-7d8f-4580-9654-81ff5ec7753c	2022-08-26	2022-08-26	0x1ac9049a122c04c34d6f4d0ccaae297b15dd3858f6743383f6f5ffc4fd06cb3d	2022-07-26	0x1b4eb7c0c821b8799fcf21e3a929970b08f528c82aed9f8e35383965f508d9dd	0	5	5	0	24	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	0	0	@HK	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	t	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
009d973e-4374-4fd8-94a1-4ab5b223662a	2022-08-29	2022-08-29	0xb34d4c5f482ad8c56b4668b832d07a0343fea02014d627945376602ff8ee04df	2022-07-29	0x9143fcd846491496542dd83f13e026b45a1e9e1509a417722bbe62b5accca077	0	12	12	0	134	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	8000000000000000000	8	@HK	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	t	2022-08-29	2022-09-13	listed	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
a475e542-9ed2-41a9-a441-17db3c641089	2022-08-26	2022-08-27	0x7ee37890b96b88323cae046471f6d9ee53002abdbc8caf21ea3ca9209d10398d	2022-07-26	0x38d2acf23e535292bef81944e8ed0fc3346eba62a34af431582766fbf69e72b9	0	9	9	0	48	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	10000000000000000000	10	@HK	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	t	2022-08-27	2022-09-11	auctioned	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
23ca1b5a-c695-4d5f-b0d4-76dcfe7ce73a	2022-08-27	2022-08-28	0xc07908e8795a68c737e177d51c1e62e675a3e84da46eedc50a6264e1b3871db5	2022-07-27	0x8a1b5042864e06eb7aea125067cb47f8c6050ab542918fec45c7a7a9233cb299	0	10	10	0	58	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	12000000000000000000	12	@HK	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	f	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
ac0063e9-886e-4134-b061-300e7d6f9cfd	2022-08-28	2022-08-28	0x1d7020a2a8f642f687c031beaae7d2924de3d1c396e39bcd209507fbbe62a5b9	2022-07-28	0xe0295636c431f0a66bed8bb274457125127e17586d89927bb99caf6bb873b46a	0	11	11	0	64	mintNft	minted nft token	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	9000000000000000000	9	@HK	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	f	\N	\N	unlisted	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
\.


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: henson
--

COPY public.offers (id, created_at, updated_at, block_hash, block_timestamp, transaction_hash, transaction_index, token_decimal, token_id, log_index, block_number, function_name, function_desc, marketplace_address, nft_address, price, price_decimal, measurement_unit, owner, offerer, deadline, collection_id) FROM stdin;
d0c38995-2dd8-4f18-8279-751dc40f3eac	2022-08-28	2022-08-28	0x120354d2214fee1ced61021f9d2b3a6b300959581e438a05d40e0d865300508c	2022-07-28	0xc9a760adff73a5eec22b7fb3b946f95c33d7fc817378b099c0940271c69a78f8	0	11	11	0	131	offer	Make Offer	0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512	0x5FbDB2315678afecb367f032d93F642f64180aa3	12000000000000000000	12	@HK	0x70997970c51812dc3a010c7d01b50e0d17dc79c8	0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc	2022-08-31	4f2a2da3-ba3c-4a5b-b31c-1d759cb32df1
\.


--
-- Name: auctions auctions_pkey; Type: CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT auctions_pkey PRIMARY KEY (id);


--
-- Name: collection_categories collection_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.collection_categories
    ADD CONSTRAINT collection_categories_pkey PRIMARY KEY (id);


--
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: nft_history nft_history_pkey; Type: CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.nft_history
    ADD CONSTRAINT nft_history_pkey PRIMARY KEY (id);


--
-- Name: nfts nfts_pkey; Type: CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.nfts
    ADD CONSTRAINT nfts_pkey PRIMARY KEY (id);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);


--
-- Name: collections collections_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.collection_categories(id);


--
-- Name: nft_history fk_collections; Type: FK CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.nft_history
    ADD CONSTRAINT fk_collections FOREIGN KEY (collection_id) REFERENCES public.collections(id);


--
-- Name: nfts fk_collections; Type: FK CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.nfts
    ADD CONSTRAINT fk_collections FOREIGN KEY (collection_id) REFERENCES public.collections(id);


--
-- Name: auctions fk_collections; Type: FK CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.auctions
    ADD CONSTRAINT fk_collections FOREIGN KEY (collection_id) REFERENCES public.collections(id);


--
-- Name: listings fk_collections; Type: FK CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT fk_collections FOREIGN KEY (collection_id) REFERENCES public.collections(id);


--
-- Name: offers fk_collections; Type: FK CONSTRAINT; Schema: public; Owner: henson
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT fk_collections FOREIGN KEY (collection_id) REFERENCES public.collections(id);


--
-- PostgreSQL database dump complete
--

