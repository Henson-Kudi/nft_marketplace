DROP DATABASE IF EXISTS nft_marketplace;

CREATE DATABASE nft_marketplace;

\c nft_marketplace;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE collection_categories(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    image VARCHAR(100)
);

CREATE TABLE collections(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    logo VARCHAR(100) NOT NULL,
    featured_image VARCHAR(100),
    banner VARCHAR(100),
    url_format VARCHAR(100),
    creator VARCHAR(100) NOT NULL,
    owner VARCHAR(100) NOT NULL,
    website VARCHAR(100),
    discord VARCHAR(100),
    telegram VARCHAR(100),
    instagram VARCHAR(100),
    facebook VARCHAR(100),
    youtube VARCHAR(100),
    category_id uuid REFERENCES collection_categories (id)
);


CREATE TABLE nft_history(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    block_hash VARCHAR(100) NOT NULL,
    block_timestamp DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_hash VARCHAR(100) NOT NULL,
    transaction_index VARCHAR(100) NOT NULL,
    block_number VARCHAR(100) NOT NULL,
    token_decimal NUMERIC NOT NULL,
    token_id INT NOT NULL,
    log_index INT NOT NULL,
    function_name VARCHAR(20) NOT NULL,
    function_desc VARCHAR(200) NOT NULL,
    nft_address VARCHAR(100) NOT NULL,
    marketplace_address VARCHAR(100) NOT NULL,
    from_address VARCHAR(100) NOT NULL,
    to_address VARCHAR(100) NOT NULL,
    value INT,
    collection_id uuid NOT NULL,
    CONSTRAINT fk_collections
        FOREIGN KEY (collection_id)
        REFERENCES collections (id)
);

CREATE TABLE nfts(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    block_hash VARCHAR(100) NOT NULL,
    block_timestamp DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_hash VARCHAR(100) NOT NULL,
    transaction_index VARCHAR(100) NOT NULL,
    token_decimal NUMERIC NOT NULL,
    token_id INT NOT NULL,
    log_index INT NOT NULL,
    block_number VARCHAR(100) NOT NULL,
    function_name VARCHAR(20) NOT NULL,
    function_desc VARCHAR(200) NOT NULL,
    marketplace_address VARCHAR(100) NOT NULL,
    nft_address VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    price_decimal NUMERIC NOT NULL,
    measurement_unit VARCHAR(20) NOT NULL DEFAULT 'ETH',
    owner VARCHAR(100) NOT NULL,
    creator VARCHAR(100) NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT FALSE,
    start_time DATE,
    end_time DATE,
    status VARCHAR(10) NOT NULL CHECK(status = 'listed' OR status = 'unlisted' OR status = 'auctioned') DEFAULT 'unlisted',
    collection_id uuid NOT NULL,
    CONSTRAINT fk_collections
        FOREIGN KEY (collection_id)
        REFERENCES collections (id)
);

CREATE TABLE auctions(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    block_hash VARCHAR(100) NOT NULL,
    block_timestamp DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_hash VARCHAR(100) NOT NULL,
    transaction_index VARCHAR(100) NOT NULL,
    token_decimal NUMERIC NOT NULL,
    token_id INT NOT NULL,
    log_index INT NOT NULL,
    block_number VARCHAR(100) NOT NULL,
    function_name VARCHAR(20) NOT NULL,
    function_desc VARCHAR(200) NOT NULL,
    marketplace_address VARCHAR(100) NOT NULL,
    nft_address VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    price_decimal NUMERIC NOT NULL,
    measurement_unit VARCHAR(20) NOT NULL DEFAULT 'ETH',
    owner VARCHAR(100) NOT NULL,
    creator VARCHAR(100) NOT NULL,
    start_time DATE NOT NULL,
    end_time DATE NOT NULL,
    collection_id uuid NOT NULL,
    CONSTRAINT fk_collections
        FOREIGN KEY (collection_id)
        REFERENCES collections (id)
);

CREATE TABLE listings(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    block_hash VARCHAR(100) NOT NULL,
    block_timestamp DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_hash VARCHAR(100) NOT NULL,
    transaction_index VARCHAR(100) NOT NULL,
    token_decimal NUMERIC NOT NULL,
    token_id INT NOT NULL,
    log_index INT NOT NULL,
    block_number VARCHAR(100) NOT NULL,
    function_name VARCHAR(20) NOT NULL,
    function_desc VARCHAR(200) NOT NULL,
    marketplace_address VARCHAR(100) NOT NULL,
    nft_address VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    price_decimal NUMERIC NOT NULL,
    measurement_unit VARCHAR(20) NOT NULL DEFAULT 'ETH',
    owner VARCHAR(100) NOT NULL,
    creator VARCHAR(100) NOT NULL,
    start_time DATE,
    end_time DATE,
    collection_id uuid NOT NULL,
    CONSTRAINT fk_collections
        FOREIGN KEY (collection_id)
        REFERENCES collections (id)
);

CREATE TABLE offers(
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    block_hash VARCHAR(100) NOT NULL,
    block_timestamp DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_hash VARCHAR(100) NOT NULL,
    transaction_index VARCHAR(100) NOT NULL,
    token_decimal NUMERIC NOT NULL,
    token_id INT NOT NULL,
    log_index INT NOT NULL,
    block_number VARCHAR(100) NOT NULL,
    function_name VARCHAR(20) NOT NULL,
    function_desc VARCHAR(200) NOT NULL,
    marketplace_address VARCHAR(100) NOT NULL,
    nft_address VARCHAR(100) NOT NULL,
    price NUMERIC NOT NULL,
    price_decimal NUMERIC NOT NULL,
    measurement_unit VARCHAR(20) NOT NULL DEFAULT 'ETH',
    owner VARCHAR(100) NOT NULL,
    offerer VARCHAR(100) NOT NULL,
    deadline DATE,
    collection_id uuid NOT NULL,
    CONSTRAINT fk_collections
        FOREIGN KEY (collection_id)
        REFERENCES collections (id)
);

INSERT INTO collection_categories(name, description, image)
    VALUES ('art', 'Welcome to the home of ART on @HK Market. Discover the best items in this collection.', 'https://ipfs.io/ipfs/QmSnkmzzB3x54segizz2dfXm3jXdpAg6kyMs2wDvRQ23Kt'),
    
    ('photo', 'Welcome to the home of photography on @HK Market. Discover the best items in this collection.', 'https://ipfs.io/ipfs/QmVhWDYiS9Hwa8DvS838ijRBZmqeXGSN6gNFLRWd6ZpEBh'),
    
    ('sports', 'Welcome to the home of sports on @HK Market. Discover the best items in this collection.', 'https://ipfs.io/ipfs/QmZVXuM7T788ExinjNL7pAf2abDQvspHs6QZDsrXSM5R82'),
    
    ('music', 'Welcome to the home of music on @HK Market. Discover the best items in this collection.', 'https://ipfs.io/ipfs/QmPRt8cDsVNa4LHoe7S9h6GcFKZJUjWUyvJRYBK6kNDV6C'),

    ('collectibles', 'Welcome to the home of collectibles on @HK Market. Discover the best items in this collection.', 'https://ipfs.io/ipfs/QmV56WE113GKrgJ8xv1FBDfmUULJjabsq3yXZL4L6BWycF');


