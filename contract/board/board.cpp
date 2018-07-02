#include "board.hpp"

void board::list(const uint64_t page) {

}

void board::write(const account_name author, const string title, const string content) {
    require_auth(author);
    
    contents content_table(_self, _self);

    id_sequence seq;
    get_id_sequence(seq);

    uint64_t id = seq._id++;
    
    content_table.emplace(author, [&](auto& mcontent) {
        mcontent._id = id;
        mcontent.title = title;
        mcontent.content = content;
        mcontent.author = author;
        mcontent.created = now();
    });

    store_id_sequence(seq);
}

void board::read(const uint64_t _id) {

}

void board::remove(const uint64_t _id) {
    contents content_table(_self, _self);

    auto iter = content_table.find(_id);
    eosio_assert(iter != content_table.end(), "Counld not found");

    require_auth(iter->author);

    content_table.erase(iter);
}
