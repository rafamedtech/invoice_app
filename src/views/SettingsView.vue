<script setup></script>

<template>
  <div class="home custom-container">
    <!-- Header -->
    <div>
      <div class="header flex flex-col gap-8">
        <div class="left flex-column flex gap-4">
          <router-link
            class="nav-link flex items-center gap-2 text-xs"
            :to="{ name: 'home' }"
          >
            <i class="fa-solid fa-chevron-left text-primary"></i> Regresar
          </router-link>
          <h1 class="text-2xl text-primary lg:text-3xl">Configuración</h1>
        </div>

        <section class="flex">
          <div class="flex basis-1/3 flex-col gap-4">
            <p>Imagen de portada</p>
            <label
              for="cover"
              class="btn w-fit border-none bg-primary hover:bg-secondary"
              >Cambiar</label
            >
            <input type="file" id="cover" class="hidden" />
          </div>
          <div class="basis-2/3">
            <figure>
              <img
                class="rounded-[20px]"
                src="@/assets/images/coverdemo.png"
                alt=""
              />
            </figure>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  color: #1a1a1a;

  .header {
    margin-bottom: 65px;

    .left,
    .right {
      flex: 1;
    }

    .right {
      justify-content: flex-end;
      // align-items: center;

      .button,
      .filter {
        align-items: center;

        span {
          font-size: 11px;
        }
      }

      .filter {
        position: relative;
        // margin-right: 40px;
        cursor: pointer;

        img {
          margin-left: 12px;
          width: 9px;
          height: 5px;
        }

        .filter-menu {
          width: 120px;
          z-index: 999;
          position: absolute;
          top: 25px;
          list-style: none;
          background-color: #fff;
          border-radius: 10px;
          // background-color: #1e2139;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);

          li {
            cursor: pointer;
            font-size: 12px;
            padding: 10px 20px;

            &:hover {
              color: #1e2139;
              background-color: #dfa48c;
              border-radius: 10px;
            }
          }
        }
      }

      .button {
        padding: 8px 10px;
        background-color: #e90f02;
        border-radius: 40px;

        .inner-button {
          margin-right: 8px;
          border-radius: 50%;
          padding: 8px;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          img {
            width: 10px;
            height: 10px;
          }
        }
      }
    }
  }

  .empty {
    margin-top: 160px;
    align-items: center;

    img {
      width: 214px;
      height: 200px;
    }

    h3 {
      font-size: 20px;
      margin-top: 40px;
    }

    p {
      text-align: center;
      max-width: 224px;
      font-size: 12px;
      font-weight: 300;
      margin-top: 16px;
    }
  }
}
</style>
