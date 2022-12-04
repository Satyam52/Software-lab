--
-- PostgreSQL database dump
--

-- Dumped from database version 13.8 (Debian 13.8-1.pgdg110+1)
-- Dumped by pg_dump version 13.8 (Debian 13.8-1.pgdg110+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: marks; Type: TABLE; Schema: public; Owner: deku
--

CREATE TABLE public.marks (
    roll character varying(256),
    lab real,
    midsem real,
    project real,
    endsem real
);


ALTER TABLE public.marks OWNER TO deku;

--
-- Name: users; Type: TABLE; Schema: public; Owner: deku
--

CREATE TABLE public.users (
    roll character varying(256) NOT NULL,
    name character varying(256) NOT NULL,
    email character varying(256) NOT NULL,
    password character varying(256) NOT NULL
);


ALTER TABLE public.users OWNER TO deku;

--
-- Data for Name: marks; Type: TABLE DATA; Schema: public; Owner: deku
--

COPY public.marks (roll, lab, midsem, project, endsem) FROM stdin;
22M0826	10	11	12	13
22M0827	20	21	22	23
22M0828	30	31	32	33
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: deku
--

COPY public.users (roll, name, email, password) FROM stdin;
22M0826	Abhishek	22M0826@email.com	22M0826
22M0827	Sameer	22M0827@email.com	22M0827
22M0828	Kratos	22M0828@email.com	22M0828
\.


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: deku
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (roll);


--
-- Name: marks marks_roll number_fkey; Type: FK CONSTRAINT; Schema: public; Owner: deku
--

ALTER TABLE ONLY public.marks
    ADD CONSTRAINT "marks_roll number_fkey" FOREIGN KEY (roll) REFERENCES public.users(roll);


--
-- PostgreSQL database dump complete
--

