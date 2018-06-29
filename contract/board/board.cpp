#include "board.hpp"

void board::list(uint64_t page) {

}

void board::write(account_name author, string title, string content) {
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

void board::read(uint64_t _id) {

}

void board::remove(uint64_t _id) {

}
