#include "board.hpp"

using namespace eosio;
namespace eos_board {
    struct impl {
    };
}

extern "C" {
    using namespace eos_board;

    void apply( uint64_t receiver, uint64_t code, uint64_t action ) {
      impl().apply(receiver, code, action);
   }
}