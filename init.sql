--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3 (Debian 16.3-1.pgdg120+1)
-- Dumped by pg_dump version 16.3 (Debian 16.3-1.pgdg120+1)

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
-- Name: fair_charge; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fair_charge (
    id integer NOT NULL,
    passenger_type character varying(20) NOT NULL,
    fare integer NOT NULL,
    CONSTRAINT fair_charge_passenger_type_check CHECK (((passenger_type)::text = ANY ((ARRAY['kid'::character varying, 'adult'::character varying, 'senior'::character varying])::text[])))
);


ALTER TABLE public.fair_charge OWNER TO postgres;

--
-- Name: fair_charge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fair_charge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fair_charge_id_seq OWNER TO postgres;

--
-- Name: fair_charge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fair_charge_id_seq OWNED BY public.fair_charge.id;


--
-- Name: location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code integer,
    CONSTRAINT location_code_check CHECK (((code >= 0) AND (code <= 999)))
);


ALTER TABLE public.location OWNER TO postgres;

--
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.location_id_seq OWNER TO postgres;

--
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;


--
-- Name: travel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.travel (
    id integer NOT NULL,
    card_id character varying(50) NOT NULL,
    travel_type character varying(20) NOT NULL,
    from_location character varying(20) NOT NULL,
    to_location character varying(20) NOT NULL,
    passenger_type character varying(20) NOT NULL,
    travel_cost numeric(10,2) NOT NULL,
    travel_date date NOT NULL,
    discount_enabled boolean DEFAULT false,
    CONSTRAINT chk_different_locations CHECK (((from_location)::text <> (to_location)::text)),
    CONSTRAINT travel_from_location_check CHECK (((from_location)::text = ANY ((ARRAY['station'::character varying, 'airport'::character varying])::text[]))),
    CONSTRAINT travel_passenger_type_check CHECK (((passenger_type)::text = ANY ((ARRAY['kid'::character varying, 'adult'::character varying, 'senior'::character varying])::text[]))),
    CONSTRAINT travel_to_location_check CHECK (((to_location)::text = ANY ((ARRAY['station'::character varying, 'airport'::character varying])::text[]))),
    CONSTRAINT travel_travel_type_check CHECK (((travel_type)::text = ANY ((ARRAY['single'::character varying, 'return'::character varying])::text[])))
);


ALTER TABLE public.travel OWNER TO postgres;

--
-- Name: travel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.travel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.travel_id_seq OWNER TO postgres;

--
-- Name: travel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.travel_id_seq OWNED BY public.travel.id;


--
-- Name: zerocard; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zerocard (
    id integer NOT NULL,
    card_number character varying(12) NOT NULL,
    balance integer DEFAULT 100,
    passenger_type character varying(20),
    discount_count integer DEFAULT 0,
    date_of_birth date,
    name character varying(100),
    CONSTRAINT zerocard_passenger_type_check CHECK (((passenger_type)::text = ANY ((ARRAY['kid'::character varying, 'adult'::character varying, 'senior'::character varying])::text[])))
);


ALTER TABLE public.zerocard OWNER TO postgres;

--
-- Name: zerocard_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zerocard_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zerocard_id_seq OWNER TO postgres;

--
-- Name: zerocard_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zerocard_id_seq OWNED BY public.zerocard.id;


--
-- Name: fair_charge id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fair_charge ALTER COLUMN id SET DEFAULT nextval('public.fair_charge_id_seq'::regclass);


--
-- Name: location id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);


--
-- Name: travel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travel ALTER COLUMN id SET DEFAULT nextval('public.travel_id_seq'::regclass);


--
-- Name: zerocard id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zerocard ALTER COLUMN id SET DEFAULT nextval('public.zerocard_id_seq'::regclass);


--
-- Name: fair_charge fair_charge_passenger_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fair_charge
    ADD CONSTRAINT fair_charge_passenger_type_key UNIQUE (passenger_type);


--
-- Name: fair_charge fair_charge_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fair_charge
    ADD CONSTRAINT fair_charge_pkey PRIMARY KEY (id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- Name: travel travel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travel
    ADD CONSTRAINT travel_pkey PRIMARY KEY (id);


--
-- Name: zerocard zerocard_card_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zerocard
    ADD CONSTRAINT zerocard_card_number_key UNIQUE (card_number);


--
-- Name: zerocard zerocard_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zerocard
    ADD CONSTRAINT zerocard_pkey PRIMARY KEY (id);


--
-- Name: travel fk_card_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.travel
    ADD CONSTRAINT fk_card_id FOREIGN KEY (card_id) REFERENCES public.zerocard(card_number);


--
-- PostgreSQL database dump complete
--